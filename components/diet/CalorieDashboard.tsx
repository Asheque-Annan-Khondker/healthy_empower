// Enhanced CalorieDashboard with macro rings, nutrition score, and meal timing insights
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from 'react-native-chart-kit';
import { Card, ActivityIndicator } from 'react-native-paper';
import { CustomCard } from "@/components/CardDetails";
import CustomChart from "@/components/CustomChart";
import MacroRings from '@/components/diet/MacroRings';
import WeeklyNutritionScore from '@/components/diet/WeeklyNutritionScore';
import MealTimingInsights from '@/components/diet/MealTimingInsights';
import { MealTimingService, MealTimingData } from '@/utils/mealTimingService';
import { NutritionDataService, NutritionSummary, WeeklyNutritionData } from '@/utils/nutritionDataService';
import { MealLogDBModal, FoodDBModal } from '@/utils/dbFunctions';
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";

export default function CalorieDashboard() {
    const [meals, setMeals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [mealTimingData, setMealTimingData] = useState<MealTimingData>({
        mostActiveEatingTime: 'Loading...',
        longestGapBetweenMeals: 0,
        averageMealsPerDay: 0,
        lastMealTime: 'Loading...',
    })
    const [nutritionSummary, setNutritionSummary] = useState<NutritionSummary>({
        protein: { current: 0, target: 150 },
        carbs: { current: 0, target: 250 },
        fats: { current: 0, target: 75 },
        totalCalories: 0,
        targetCalories: 2000
    })
    const [weeklyNutritionData, setWeeklyNutritionData] = useState<WeeklyNutritionData>({
        score: 0,
        balancedDays: 0,
        totalDays: 7,
        trend: 'stable'
    })
    const [data, setData] = useState({
        labels: [] as string[],
        datasets: [{data: [] as number[]}]
    })
    console.log("CalorieDashboard has been called")

    // Method to get calorie history data from meal logs
    async function getCalorieHistoryData() {
        try {
            // Get data for last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            // Get meal logs from last 30 days
            const mealLogs = await MealLogDBModal.get({
                logged_at: { gte: thirtyDaysAgo.toISOString() }
            });
            
            if (!mealLogs || mealLogs.length === 0) {
                console.log("📊 No meal logs found for calorie chart");
                return [];
            }
            
            // Get unique food IDs and fetch food data
            const uniqueFoodIds = [...new Set(mealLogs.map(log => log.food_id))];
            const foodsData = await Promise.all(
                uniqueFoodIds.map(foodId => 
                    FoodDBModal.get({ food_id: { eq: foodId } })
                )
            ).then(results => results.flat());
            
            // Group meals by date and calculate daily calories
            const dailyCalories: { [date: string]: number } = {};
            
            mealLogs.forEach(meal => {
                const dateKey = new Date(meal.logged_at).toISOString().split('T')[0];
                const food = foodsData.find(f => f.food_id === meal.food_id);
                
                if (food) {
                    const servings = meal.servings || 1;
                    const mealCalories = (food.calories || 0) * servings;
                    
                    if (!dailyCalories[dateKey]) {
                        dailyCalories[dateKey] = 0;
                    }
                    dailyCalories[dateKey] += mealCalories;
                }
            });
            
            // Convert to array format for chart
            const result = Object.entries(dailyCalories).map(([date, total_calories]) => ({
                date,
                total_calories: Math.round(total_calories)
            }));
            
            console.log("📊 Calorie chart data loaded:", result.length, "days");
            return result;
            
        } catch (error) {
            console.error("📊 Error loading calorie chart data:", error);
            return [];
        }
    }

    async function loadHistory() {
        try {
            // 1. Log the filter date
            const monthago = new Date()
            monthago.setDate(monthago.getDate() - 30)
            const monthagostr = monthago.toISOString().split('T')[0]
            console.log("FILTER DATE:", monthagostr) // e.g. 2024-02-11

            setLoading(true)
            
            // Load meal timing insights from real database
            console.log("🕐 Loading meal timing insights...");
            const timingData = await MealTimingService.calculateMealTimingInsights();
            setMealTimingData(timingData);
            console.log("🕐 Meal timing data loaded:", timingData);

            // Load real nutrition data in parallel
            const [mealTimingInsights, todaysMacros, weeklyNutrition] = await Promise.all([
                MealTimingService.calculateMealTimingInsights(),
                NutritionDataService.getTodaysMacros(),
                NutritionDataService.getWeeklyNutritionScore()
            ]);

            setMealTimingData(mealTimingInsights);
            setNutritionSummary(todaysMacros);
            setWeeklyNutritionData(weeklyNutrition);

            // Get calorie data for the chart from real meal logs
            console.log("📊 Loading calorie chart data...");
            const labels = []
            const calories = []
            
            // Get actual calorie data from last 30 days
            const result = await getCalorieHistoryData();

            // just in case if data is not loaded for the graph, which leads to crashes.
            console.log("📊 Chart result data:", result);
            if (result.length == 0) {
                console.log("📊 No real data found, using mock data for chart");

                let calorieMap: { [key: string]: number } = {};
                // result.map(row => {calorieMap[row.date] = row.total_calories})

                for (let i = 0; i < 30; i++) {

                    const date = new Date()
                    date.setDate(date.getDate() - (29 - i))
                    const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD
                    const shortLabel = dateStr.substring(5) // MM-DD

                    labels.push(shortLabel)
                    calories.push(calorieMap[dateStr] || 0) // fills in missing calories with zero

                }
            } else {
                console.log("📊 Using real calorie data for chart:", result.length, "days");
                
                // Create a map of the real data
                const calorieMap: { [key: string]: number } = {};
                result.forEach((row: any) => {
                    calorieMap[row.date] = row.total_calories;
                });
                
                // Fill in all 30 days, using real data where available and 0 for missing days
                for (let i = 0; i < 30; i++) {
                    const date = new Date();
                    date.setDate(date.getDate() - (29 - i));
                    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
                    const shortLabel = dateStr.substring(5); // MM-DD

                    labels.push(shortLabel);
                    calories.push(calorieMap[dateStr] || 0); // Use real data or 0 if no meals that day
                }
            }
            setData({
                labels,
                datasets: [{data: calories}]
            })
            console.log("📊 Chart data set - Labels:", labels.length, "Calories:", calories.length);
            console.log("📊 Chart calories sample:", calories.slice(0, 5));
            console.log("Check retrieval", JSON.stringify(result))

            setLoading(false)

        } catch (err) {
            console.log("ERROR:", err)
            setError('Failed to Load data')
            setLoading(false)
        }

    }

    //initial mount
    useEffect(() => {
        loadHistory()
    }, [])
    //subsequent mount every screen refresh
    useFocusEffect(
        useCallback(() => {
            loadHistory()

            return () => {
                console.log('Screen unfocused')
            }
        }, [])
    )
    if (loading) {
        return (
            <Card>
                <Card.Content>
                    <ActivityIndicator size={'large'} color="#0000ff"/>
                    <Text>Loading your calorie history...</Text>
                </Card.Content>
            </Card>
        )
    }
    else {
        return(
            <View style={styles.dashboardContainer}>
                {/* Macro Rings Component - Using Real Data */}
                <MacroRings 
                    protein={nutritionSummary.protein}
                    carbs={nutritionSummary.carbs}
                    fats={nutritionSummary.fats}
                />
                
                {/* Weekly Nutrition Score - Using Real Data */}
                <WeeklyNutritionScore 
                    score={weeklyNutritionData.score}
                    balancedDays={weeklyNutritionData.balancedDays}
                    totalDays={weeklyNutritionData.totalDays}
                    trend={weeklyNutritionData.trend}
                />
                
                {/* Meal Timing Insights - Using Real Data */}
                <MealTimingInsights 
                    mostActiveEatingTime={mealTimingData.mostActiveEatingTime}
                    longestGapBetweenMeals={mealTimingData.longestGapBetweenMeals}
                    averageMealsPerDay={mealTimingData.averageMealsPerDay}
                    lastMealTime={mealTimingData.lastMealTime}
                />
                
                {/* Original Calorie Chart */}
                <CalorieChart data={data}/>
            </View>
        )
    }
}

interface calorieChartProps {
    data: {
        labels: string[],
        datasets: { data: number[] }[]
    }
}



const CalorieChart = (props: calorieChartProps) => {
    // default destructuring
    // const {
    //     data = [{data: []}],
    // } = props;
    //

    const chart = (
       <LineChart
        style={styles.chart}
        data={props.data}
        width={Dimensions.get("window").width-60}
        height={220}
        chartConfig={{
          backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
          }
        }}
        bezier
    />)
    const test = true;
    if(test){
        // change data into something digestable for the chart
        console.log("Reached Custom")
        const changedData = props.data.datasets[0].data.map((value, index) => { return {value: value, label: props.data.labels[index]}})
        return(
            <View>
            <CustomChart type={'line'} data={changedData} />
        {/*<StarRailChart data={changedData} chartType={"line"}/>*/}
            </View>
        )
    }
    else {

        return (
            <CustomCard 
                onPress={() => alert("It'sa me Boshun!")} 
                textContent={{
                    title: "Calorie History",
                    subtitle: "Last 30 days",
                    description: "Your calorie intake for the last 30 days",
                    paragraph: "This is a chart of your calorie intake for the last 30 days"
                }}
                iconProps={{icon: "chart-line", size: 40, color: "blue"}}
                variant={"elevated"} 
                mainComponent={chart}
            />
        )
    }
}
const  CalorieStats = () => {}


























const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 4,
    borderRadius: 12,
    width: Dimensions.get("window").width - 30
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 30,
    color: '#888',
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

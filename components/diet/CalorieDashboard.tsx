// Todo: Make a streak presentor, weight line graph
// Subquests. Make an animation where the bar graphs do visualisor bounce before settling
// MVP: 
// 1. Thw dashboard has to show previous food entry list with an inputter,






import { useFocusEffect } from "expo-router";
import { useFilterScreenChildren } from "expo-router/build/layouts/withLayoutContext";
import React, { useCallback } from "react";
import {useEffect, useState} from 'react'
import { View, Text, StyleSheet, Dimensions } from "react-native";
import {LineChart} from 'react-native-chart-kit'
import {Card, Title, Paragraph, ActivityIndicator} from 'react-native-paper'
import {CustomCard} from "@/components/CardDetails";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import CustomChart from "@/components/CustomChart";
// import StarRailChart from "@/components/test-star-railchart";

export default function CalorieDashboard() {
    const [meals, setMeals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [data, setData] = useState({
        labels: [] as string[],
        datasets: [{data: [] as number[]}]
    })
    console.log("CalorieDashboard has been called")

    async function loadHistory() {
        try {
            // 1. Log the filter date
            const monthago = new Date()
            monthago.setDate(monthago.getDate() - 30)
            const monthagostr = monthago.toISOString().split('T')[0]
            console.log("FILTER DATE:", monthagostr) // e.g. 2024-02-11

            setLoading(true)


            // // 2. Check if ANY data exists
            // const checkResult = await db.getAllAsync(`SELECT COUNT(*) as count FROM food_entries`)
            // console.log("TOTAL ENTRIES:", checkResult[0]?.count)

            // // 3. Check ALL dates without filter
            // const dateCheck = await db.getAllAsync(`SELECT DISTINCT date FROM food_entries`)
            // console.log("ALL DATES IN DB:", JSON.stringify(dateCheck))
            
            // Get all food through modal functions
           const labels = []
            const calories = []

            // just in case if data is not loaded for the graph, which leads to crashes.

            if (result.length == 0) {

                let calorieMap: { String: Number };
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
                result.map(row => {
                    labels.push(row.date)
                    calories.push(row.total_calories)
                })
            }
            setData({
                labels,
                datasets: [{data: calories}]
            })
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
            <CalorieChart data={data}/>
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
            <CustomCard onPress={() => alert("It'sa me Boshun!")} textContent={
                {
                    title: "Calorie History",
                    subtitle: "Last 30 days",
                    description: "Your calorie intake for the last 30 days",
                    paragraph: "This is a chart of your calorie intake for the last 30 days"
                }
            } icon={
                {

                    iconProps: {icon: "chart-line", size: 40, color: "blue"},
                }
            }
                        variant={"elevated"} mainComponent={chart}/>


        )
    }
}
const  CalorieStats = () => {}


























const styles = StyleSheet.create({
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

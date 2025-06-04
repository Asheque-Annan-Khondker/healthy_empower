import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DailyFoodLog from '@/components/DailyFoodLog';
import CalorieDashboard from '@/components/diet/CalorieDashboard';
import GoalProgressHeader from '@/components/diet/GoalProgressHeader';
import { NutritionDataService } from '@/utils/nutritionDataService';

export default function DietScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [nutritionData, setNutritionData] = useState({
    protein: { current: 0, target: 150 },
    carbs: { current: 0, target: 250 },
    fats: { current: 0, target: 75 },
    totalCalories: 0,
    targetCalories: 2200
  });

  // Load nutrition data
  const loadNutritionData = useCallback(async () => {
    try {
      const data = await NutritionDataService.getTodaysMacros();
      setNutritionData(data);
      console.log('🍎 Diet Screen: Nutrition data loaded:', data);
    } catch (error) {
      console.error('🍎 Diet Screen: Error loading nutrition data:', error);
    }
  }, []);
  // Manual refresh functionality using useFocusEffect (reverted from automatic refresh)
  useFocusEffect(
    useCallback(() => {
      console.log('🍎 Diet Screen: Screen focused, triggering manual refresh');
      setRefreshTrigger(prev => prev + 1);
      loadNutritionData(); // Load nutrition data when screen focuses
      
      return () => {
        console.log('🍎 Diet Screen: Screen unfocused');
      };
    }, [loadNutritionData])
  );
  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    console.log('🔄 Diet Screen: Pull-to-refresh triggered');
    setIsRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
    loadNutritionData(); // Refresh nutrition data
    
    // Simulate refresh completion
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, [loadNutritionData]);
  // Function to trigger refresh when food is added
  const triggerFoodLogRefresh = useCallback(() => {
    console.log('🍽️ Diet Screen: Food added, refreshing data');
    setRefreshTrigger(prev => prev + 1);    loadNutritionData(); // Refresh nutrition data when food is added
  }, [loadNutritionData]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content with Pull-to-Refresh */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#D68D54']}
            tintColor="#D68D54"
          />
        }      >        {/* Daily Goals Progress Header */}
        <GoalProgressHeader 
          currentCalories={nutritionData.totalCalories}
          goalCalories={nutritionData.targetCalories}
          currentProtein={nutritionData.protein.current}
          goalProtein={nutritionData.protein.target}
          currentCarbs={nutritionData.carbs.current}
          goalCarbs={nutritionData.carbs.target}
          currentFat={nutritionData.fats.current}
          goalFat={nutritionData.fats.target}
        />

        {/* Calorie Dashboard */}
        <CalorieDashboard />        {/* Daily Food Log */}
        <DailyFoodLog 
          date={currentDate}
          refreshTrigger={refreshTrigger}
          onFoodAdded={triggerFoodLogRefresh}
        />
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F4',
  },
  content: {
    flex: 1,
    backgroundColor: '#FAF7F4',
  },
});
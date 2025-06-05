import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar as PaperProgressBar } from 'react-native-paper';

interface GoalProgressHeaderProps {
  currentCalories: number;
  goalCalories: number;
  currentProtein: number;
  goalProtein: number;
  currentCarbs: number;
  goalCarbs: number;
  currentFat: number;
  goalFat: number;
}

export default function GoalProgressHeader({
  currentCalories,
  goalCalories,
  currentProtein,
  goalProtein,
  currentCarbs,
  goalCarbs,
  currentFat,
  goalFat,
}: GoalProgressHeaderProps) {
  const calorieProgress = Math.min(currentCalories / goalCalories, 1);
  const proteinProgress = Math.min(currentProtein / goalProtein, 1);
  const carbsProgress = Math.min(currentCarbs / goalCarbs, 1);
  const fatProgress = Math.min(currentFat / goalFat, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Daily Goals Progress</Text>
      
      {/* Calories Progress */}
      <View style={styles.progressItem}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>🔥 Calories</Text>
          <Text style={styles.progressValues}>
            {Math.round(currentCalories)} / {goalCalories} kcal
          </Text>
        </View>
        <PaperProgressBar 
          progress={calorieProgress} 
          color="#D68D54" 
          style={styles.progressBar}
        />
        <Text style={styles.progressPercentage}>
          {Math.round(calorieProgress * 100)}% complete
        </Text>
      </View>

      {/* Macros Progress Row */}
      <View style={styles.macrosRow}>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>💪 Protein</Text>
          <PaperProgressBar 
            progress={proteinProgress} 
            color="#E74C3C" 
            style={styles.macroProgressBar}
          />
          <Text style={styles.macroValues}>{Math.round(currentProtein)}g / {goalProtein}g</Text>
        </View>

        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>⚡ Carbs</Text>
          <PaperProgressBar 
            progress={carbsProgress} 
            color="#3498DB" 
            style={styles.macroProgressBar}
          />
          <Text style={styles.macroValues}>{Math.round(currentCarbs)}g / {goalCarbs}g</Text>
        </View>

        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>🥑 Fats</Text>
          <PaperProgressBar 
            progress={fatProgress} 
            color="#F39C12" 
            style={styles.macroProgressBar}
          />
          <Text style={styles.macroValues}>{Math.round(currentFat)}g / {goalFat}g</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3A2A1F',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressItem: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A2A1F',
  },
  progressValues: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9B8579',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressPercentage: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3A2A1F',
    textAlign: 'center',
    marginBottom: 8,
  },
  macroProgressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  macroValues: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
});

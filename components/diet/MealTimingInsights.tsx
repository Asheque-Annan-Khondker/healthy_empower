import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface MealTimingInsightsProps {
  mostActiveEatingTime: string;
  longestGapBetweenMeals: number;
  averageMealsPerDay: number;
  lastMealTime: string;
}

export default function MealTimingInsights({
  mostActiveEatingTime,
  longestGapBetweenMeals,
  averageMealsPerDay,
  lastMealTime,
}: MealTimingInsightsProps) {
  
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'time':
        return <MaterialIcons name="schedule" size={20} color="#3498DB" />;
      case 'gap':
        return <MaterialIcons name="timeline" size={20} color="#E74C3C" />;
      case 'frequency':
        return <MaterialIcons name="restaurant" size={20} color="#27AE60" />;
      case 'last':
        return <MaterialIcons name="access-time" size={20} color="#F39C12" />;
      default:
        return <MaterialIcons name="insights" size={20} color="#9B59B6" />;
    }
  };

  const formatGapTime = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    } else if (hours < 24) {
      return `${Math.round(hours * 10) / 10} hours`;
    } else {
      return `${Math.round(hours / 24 * 10) / 10} days`;
    }
  };

  const getGapColor = (hours: number) => {
    if (hours > 16) return '#E74C3C'; // Too long
    if (hours > 8) return '#F39C12';  // Getting long
    return '#27AE60'; // Good
  };

  const insights = [
    {
      icon: getInsightIcon('time'),
      title: 'Most Active Eating Time',
      value: mostActiveEatingTime,
      subtitle: 'Peak meal logging period',
    },
    {
      icon: getInsightIcon('gap'),
      title: 'Longest Gap Between Meals',
      value: formatGapTime(longestGapBetweenMeals),
      subtitle: longestGapBetweenMeals > 8 ? 'Consider more frequent meals' : 'Good meal spacing',
      color: getGapColor(longestGapBetweenMeals),
    },
    {
      icon: getInsightIcon('frequency'),
      title: 'Average Meals Per Day',
      value: `${averageMealsPerDay.toFixed(1)} meals`,
      subtitle: averageMealsPerDay >= 3 ? 'Great consistency!' : 'Try to log more regularly',
    },
    {
      icon: getInsightIcon('last'),
      title: 'Last Meal',
      value: lastMealTime,
      subtitle: 'Time since last logged meal',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meal Timing Insights</Text>
      
      {insights.map((insight, index) => (
        <View key={index} style={styles.insightItem}>
          <View style={styles.insightHeader}>
            {insight.icon}
            <Text style={styles.insightTitle}>{insight.title}</Text>
          </View>
          <Text style={[
            styles.insightValue,
            insight.color && { color: insight.color }
          ]}>
            {insight.value}
          </Text>
          <Text style={[
            styles.insightSubtitle,
            insight.color && { color: insight.color }
          ]}>
            {insight.subtitle}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 20,
    textAlign: 'center',
  },
  insightItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A2A1F',
    marginLeft: 8,
    flex: 1,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 4,
  },
  insightSubtitle: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

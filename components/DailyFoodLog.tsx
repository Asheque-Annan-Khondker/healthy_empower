import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

// Helper functions to manage food entries (in a real app, these would interact with a backend)
const mockFoodEntries = [
  {
    id: '1',
    name: 'Grilled Chicken Salad',
    calories: 350,
    protein: 30,
    carbs: 15,
    fat: 12,
    mealType: 'Lunch',
    time: '12:30 PM',
    date: '16/05/2025'
  },
  {
    id: '2',
    name: 'Protein Shake',
    calories: 220,
    protein: 25,
    carbs: 10,
    fat: 5,
    mealType: 'Snack',
    time: '4:00 PM',
    date: '16/05/2025'
  },
  {
    id: '3',
    name: 'Oatmeal with Berries',
    calories: 290,
    protein: 8,
    carbs: 45,
    fat: 6,
    mealType: 'Breakfast',
    time: '8:00 AM',
    date: '16/05/2025'
  }
];

// Helper function to format date in DD/MM/YYYY format
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

interface DailyFoodLogProps {
  date: Date;
  onAddPress: () => void;
}

const DailyFoodLog: React.FC<DailyFoodLogProps> = ({ date, onAddPress }) => {
  const [foodEntries, setFoodEntries] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFat, setTotalFat] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load food entries for the selected date
  useEffect(() => {
    // In a real app, this would be an API call or database query
    setIsLoading(true);
    
    const formattedDate = formatDate(date);
    const entries = mockFoodEntries.filter(entry => entry.date === formattedDate);
    
    setFoodEntries(entries);
    
    // Calculate nutrition totals
    const calories = entries.reduce((sum, entry) => sum + entry.calories, 0);
    const protein = entries.reduce((sum, entry) => sum + entry.protein, 0);
    const carbs = entries.reduce((sum, entry) => sum + entry.carbs, 0);
    const fat = entries.reduce((sum, entry) => sum + entry.fat, 0);
    
    setTotalCalories(calories);
    setTotalProtein(protein);
    setTotalCarbs(carbs);
    setTotalFat(fat);
    
    setIsLoading(false);
  }, [date]);

  const getMealTypeIcon = (mealType) => {
    switch(mealType.toLowerCase()) {
      case 'breakfast':
        return 'free-breakfast';
      case 'lunch':
        return 'restaurant';
      case 'dinner':
        return 'dinner-dining';
      case 'snack':
        return 'fastfood';
      default:
        return 'restaurant';
    }
  };

  const renderFoodItem = ({ item }) => (
    <Card style={styles.foodCard}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.mealIconContainer}>
          <MaterialIcons name={getMealTypeIcon(item.mealType)} size={24} color="#D68D54" />
        </View>
        <View style={styles.foodInfo}>
          <View>
            <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.mealTypeText}>{item.mealType} • {item.time}</Text>
          </View>
          <View style={styles.nutritionInfo}>
            <Text style={styles.calorieText}>{item.calories} cal</Text>
            <View style={styles.macros}>
              <Text style={styles.macroText}>P: {item.protein}g</Text>
              <Text style={styles.macroText}>C: {item.carbs}g</Text>
              <Text style={styles.macroText}>F: {item.fat}g</Text>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="restaurant" size={50} color="#D68D5480" style={styles.emptyStateIcon} />
      <Text style={styles.emptyStateText}>No food entries for today</Text>
      <Text style={styles.emptyStateSubtext}>Tap "Add Food" to log your meals</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with title and Add button */}
      <View style={styles.header}>
        <View>
          <Text style={styles.sectionTitle}>Daily Food Log</Text>
          <Text style={styles.caloriesText}>{totalCalories} calories</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
          <MaterialIcons name="add" size={20} color="white" />
          <Text style={styles.addButtonText}>Add Food</Text>
        </TouchableOpacity>
      </View>
      
      {/* Nutrition summary section */}
      <View style={styles.nutritionSummary}>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{totalProtein}g</Text>
          <Text style={styles.macroLabel}>Protein</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{totalCarbs}g</Text>
          <Text style={styles.macroLabel}>Carbs</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{totalFat}g</Text>
          <Text style={styles.macroLabel}>Fat</Text>
        </View>
      </View>
      
      <Divider style={styles.divider} />
      
      {/* Food entries list */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading food entries...</Text>
        </View>
      ) : foodEntries.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={foodEntries}
          renderItem={renderFoodItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={false} // Disable scrolling within this component
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 20,
    padding: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(214, 141, 84, 0.2)',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(214, 141, 84, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A2A1F',
  },
  caloriesText: {
    fontSize: 14,
    color: '#D68D54',
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D68D54',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  nutritionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A2A1F',
  },
  macroLabel: {
    fontSize: 12,
    color: '#9B8579',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(214, 141, 84, 0.2)',
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    color: '#9B8579',
    fontSize: 14,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A2A1F',
    marginTop: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9B8579',
    marginTop: 4,
  },
  listContainer: {
    padding: 12,
  },
  foodCard: {
    marginVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    borderWidth: 1,
    borderColor: 'rgba(214, 141, 84, 0.1)',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  mealIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(214, 141, 84, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  foodInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A2A1F',
    marginBottom: 2,
  },
  mealTypeText: {
    fontSize: 12,
    color: '#9B8579',
  },
  nutritionInfo: {
    alignItems: 'flex-end',
  },
  calorieText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D68D54',
    marginBottom: 2,
  },
  macros: {
    flexDirection: 'row',
  },
  macroText: {
    fontSize: 12,
    color: '#9B8579',
    marginLeft: 8,
  },
});

export default DailyFoodLog;
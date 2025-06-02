import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Button, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

// Meal type options
const mealTypes = [
  { id: 'breakfast', label: 'Breakfast', icon: 'free-breakfast' },
  { id: 'lunch', label: 'Lunch', icon: 'restaurant' },
  { id: 'dinner', label: 'Dinner', icon: 'dinner-dining' },
  { id: 'snack', label: 'Snack', icon: 'fastfood' },
];

interface FoodEntryFormProps {
  onSave: (foodEntry: any) => void;
  onCancel: () => void;
}

const FoodEntryForm: React.FC<FoodEntryFormProps> = ({ onSave, onCancel }) => {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [time, setTime] = useState('');

  // Set default time to current time
  React.useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    setTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
  }, []);

  const handleSave = () => {
    // Validate inputs
    if (!foodName || !calories || !selectedMealType) {
      alert('Please fill in the required fields: Food name, calories, and meal type');
      return;
    }

    // Create food entry object
    const foodEntry = {
      name: foodName,
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0,
      mealType: selectedMealType,
      time: time,
    };

    // Pass the food entry to the parent component
    onSave(foodEntry);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Food Name Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Food Name*</Text>
        <TextInput
          style={styles.input}
          value={foodName}
          onChangeText={setFoodName}
          placeholder="E.g., Grilled Chicken Salad"
          placeholderTextColor="#9B8579"
        />
      </View>

      {/* Calories Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Calories*</Text>
        <TextInput
          style={styles.input}
          value={calories}
          onChangeText={setCalories}
          placeholder="E.g., 350"
          placeholderTextColor="#9B8579"
          keyboardType="numeric"
        />
      </View>

      {/* Macros Row */}
      <Text style={styles.sectionLabel}>Macronutrients (grams)</Text>
      <View style={styles.macrosRow}>
        <View style={styles.macroInputContainer}>
          <Text style={styles.macroLabel}>Protein</Text>
          <TextInput
            style={styles.macroInput}
            value={protein}
            onChangeText={setProtein}
            placeholder="0"
            placeholderTextColor="#9B8579"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.macroInputContainer}>
          <Text style={styles.macroLabel}>Carbs</Text>
          <TextInput
            style={styles.macroInput}
            value={carbs}
            onChangeText={setCarbs}
            placeholder="0"
            placeholderTextColor="#9B8579"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.macroInputContainer}>
          <Text style={styles.macroLabel}>Fat</Text>
          <TextInput
            style={styles.macroInput}
            value={fat}
            onChangeText={setFat}
            placeholder="0"
            placeholderTextColor="#9B8579"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Meal Type Selection */}
      <Text style={styles.sectionLabel}>Meal Type*</Text>
      <View style={styles.mealTypeContainer}>
        {mealTypes.map((meal) => (
          <TouchableOpacity
            key={meal.id}
            style={[
              styles.mealTypeButton,
              selectedMealType === meal.id && styles.selectedMealType,
            ]}
            onPress={() => setSelectedMealType(meal.id)}
          >
            <MaterialIcons
              name={meal.icon as any}
              size={24}
              color={selectedMealType === meal.id ? '#FFFFFF' : '#D68D54'}
            />
            <Text
              style={[
                styles.mealTypeText,
                selectedMealType === meal.id && styles.selectedMealTypeText,
              ]}
            >
              {meal.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Time Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Time</Text>
        <TextInput
          style={styles.input}
          value={time}
          onChangeText={setTime}
          placeholder="E.g., 12:30 PM"
          placeholderTextColor="#9B8579"
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A2A1F',
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: 'rgba(214, 141, 84, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#3A2A1F',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A2A1F',
    marginBottom: 12,
    marginTop: 8,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  macroInputContainer: {
    flex: 1,
    marginRight: 10,
  },
  macroLabel: {
    fontSize: 14,
    color: '#9B8579',
    marginBottom: 6,
  },
  macroInput: {
    height: 46,
    borderWidth: 1,
    borderColor: 'rgba(214, 141, 84, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#3A2A1F',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  mealTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  mealTypeButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(214, 141, 84, 0.5)',
    backgroundColor: 'rgba(214, 141, 84, 0.05)',
  },
  selectedMealType: {
    backgroundColor: '#D68D54',
    borderColor: '#D68D54',
  },
  mealTypeText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#D68D54',
  },
  selectedMealTypeText: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    marginRight: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D68D54',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#D68D54',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    marginLeft: 8,
    borderRadius: 24,
    backgroundColor: '#D68D54',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#B25B28',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FoodEntryForm;
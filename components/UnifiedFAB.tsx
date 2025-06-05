import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { FAB, Portal, Modal, Provider, Text, Button, Searchbar, Card } from 'react-native-paper';
import FoodInputModal from './FoodInputModal';
import { FoodDBModal, MealLogDBModal } from '@/utils/dbFunctions';
import { Food } from '@/utils/table.types';
import { CURRENT_USER_ID } from '@/utils/authState';

interface UnifiedFABProps {
  screenType?: 'home' | 'diet' | 'shop' | 'achievements';
  onFoodAdded?: () => void;
  onMealAdded?: () => void;
}

const UnifiedFAB: React.FC<UnifiedFABProps> = ({ 
  screenType = 'home', 
  onFoodAdded, 
  onMealAdded
}) => {
  console.log(`🔧 UnifiedFAB: Component mounted on ${screenType} screen`);
  
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [isFoodModalVisible, setIsFoodModalVisible] = useState(false);
  const [isMealModalVisible, setIsMealModalVisible] = useState(false);
    // Meal selection state
  const [availableFoods, setAvailableFoods] = useState<Food[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);
  const [servings, setServings] = useState('1');

  // Load available foods when meal modal opens
  useEffect(() => {
    if (isMealModalVisible) {
      loadAvailableFoods();
    }
  }, [isMealModalVisible]);

  const loadAvailableFoods = async () => {
    try {
      const foods = await FoodDBModal.get();
      setAvailableFoods(foods);
      console.log('🍽️ UnifiedFAB: Loaded', foods.length, 'available foods');
    } catch (error) {
      console.error('❌ UnifiedFAB: Error loading foods:', error);
    }
  };

  const handleFoodFormSave = async (foodEntry: any) => {
    console.log('💾 UnifiedFAB: Saving food entry:', foodEntry);
    try {
      // Create new food entry in database
      await FoodDBModal.insert({
        name: foodEntry.name,
        calories: foodEntry.calories,
        protein: foodEntry.protein,
        carbs: foodEntry.carbs,
        fat: foodEntry.fat,
        meal_type: foodEntry.mealType,
      });      // Create meal log entry
      await MealLogDBModal.create({
        user_id: CURRENT_USER_ID || 1, // Fallback to user ID 1 if not set
        food_id: foodEntry.name, // Using name as ID for now
        meal_type: foodEntry.mealType,
        servings: 1,
        logged_at: new Date().toISOString(),
      });

      console.log('✅ UnifiedFAB: Food entry saved successfully');
      setIsFoodModalVisible(false);
      onFoodAdded?.();
      onMealAdded?.();
    } catch (error) {
      console.error('❌ UnifiedFAB: Error saving food entry:', error);
    }
  };  const handleMealFormSave = async () => {
    if (selectedFoods.length === 0) {
      console.log('❌ UnifiedFAB: No foods selected for meal log');
      return;
    }

    console.log('🍽️ UnifiedFAB: Saving meal logs for', selectedFoods.length, 'foods');
    try {      // Create meal log entries for all selected foods using Promise.all
      const mealLogPromises = selectedFoods.map(food => 
        MealLogDBModal.create({
          user_id: CURRENT_USER_ID || 1, // Fallback to user ID 1 if not set
          food_id: food.food_id,
          meal_type: 'snack', // Default meal type
          servings: parseFloat(servings) || 1,
          logged_at: new Date().toISOString(),
        })
      );

      await Promise.all(mealLogPromises);

      console.log('✅ UnifiedFAB: All meal logs saved successfully');
      setIsMealModalVisible(false);
      setSelectedFoods([]);
      setServings('1');
      setSearchQuery('');
      onMealAdded?.();
    } catch (error) {
      console.error('❌ UnifiedFAB: Error saving meal logs:', error);
    }
  };

  const filteredFoods = availableFoods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <FAB.Group
        open={isGroupOpen}
        visible
        icon={isGroupOpen ? 'close' : 'plus'}
        actions={[
          {
            icon: 'food-apple',
            label: 'Create New Food',
            onPress: () => {
              console.log('🍴 UnifiedFAB: User selected Create New Food');
              setIsGroupOpen(false);
              setIsFoodModalVisible(true);
            },
            style: { backgroundColor: '#D68D54' },
          },
          {
            icon: 'silverware-fork-knife',
            label: 'Log Existing Meal',
            onPress: () => {
              console.log('🥘 UnifiedFAB: User selected Log Existing Meal');
              setIsGroupOpen(false);
              setIsMealModalVisible(true);
            },
            style: { backgroundColor: '#D68D54' },
          },
        ]}
        onStateChange={({ open }) => {
          console.log(`🎯 UnifiedFAB: FAB group ${open ? 'opened' : 'closed'}`);
          setIsGroupOpen(open);
        }}
        onPress={() => {
          if (isGroupOpen) {
            console.log('🔥 UnifiedFAB: FAB group closing');
            setIsGroupOpen(false);
          }
        }}
        fabStyle={styles.fab}
      />      {/* Food Input Modal */}
      <FoodInputModal
        visible={isFoodModalVisible}
        onClose={() => setIsFoodModalVisible(false)}
        onSave={handleFoodFormSave}
        mode="food"
      />{/* Meal Entry Modal */}
      <Portal>        <Modal
          visible={isMealModalVisible}
          onDismiss={() => setIsMealModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.mealModalContent}>
            <Text style={styles.modalTitle}>Log Existing Meal</Text>
            <Text style={styles.modalSubtitle}>Search and select a food to log</Text>
            
            {/* Search Bar */}
            <Searchbar
              placeholder="Search for foods..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
            />            {/* Selected Foods Display */}
            {selectedFoods.length > 0 && (
              <Card style={styles.selectedFoodCard}>
                <Card.Content>
                  <Text style={styles.selectedFoodTitle}>
                    Selected Foods ({selectedFoods.length})
                  </Text>
                  {selectedFoods.map((food, index) => (
                    <Text key={food.food_id} style={styles.selectedFoodInfo}>
                      • {food.name} - {food.calories} cal
                    </Text>
                  ))}
                </Card.Content>
              </Card>
            )}            {/* Food List */}
            <FlatList
              data={filteredFoods}
              keyExtractor={(item) => item.food_id.toString()}
              style={styles.foodList}
              renderItem={({ item }) => {
                const isSelected = selectedFoods.some(food => food.food_id === item.food_id);
                return (
                  <TouchableOpacity
                    style={[
                      styles.foodItem,
                      isSelected && styles.selectedFoodItem
                    ]}
                    onPress={() => {
                      console.log('🍽️ UnifiedFAB: Toggling food selection:', item.name);
                      if (isSelected) {
                        // Remove from selection
                        setSelectedFoods(prev => prev.filter(food => food.food_id !== item.food_id));
                      } else {
                        // Add to selection
                        setSelectedFoods(prev => [...prev, item]);
                      }
                    }}
                  >
                    <View style={styles.foodItemContent}>
                      <View style={styles.foodInfo}>
                        <Text style={styles.foodName}>{item.name}</Text>
                        <Text style={styles.foodMacros}>
                          {item.calories} cal • P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                        </Text>
                      </View>
                      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                        {isSelected && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  {searchQuery ? 'No foods found matching your search' : 'No foods available. Create some foods first!'}
                </Text>
              }
            />            <View style={styles.buttonContainer}>
              <Button 
                mode="contained" 
                onPress={handleMealFormSave}
                style={styles.saveButton}
                buttonColor="#D68D54"
                disabled={selectedFoods.length === 0}
              >
                Add {selectedFoods.length} Food{selectedFoods.length !== 1 ? 's' : ''} to Log
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => setIsMealModalVisible(false)}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    backgroundColor: '#D68D54',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  mealModalContent: {
    minHeight: 300,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#9B8579',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchBar: {
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
  },
  selectedFoodCard: {
    marginBottom: 16,
    backgroundColor: '#E8F5E8',
  },
  selectedFoodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  selectedFoodInfo: {
    fontSize: 14,
    color: '#388E3C',
    marginTop: 4,
  },
  foodList: {
    maxHeight: 200,
    marginBottom: 16,
  },  foodItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
  },
  selectedFoodItem: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#D68D54',
  },
  foodItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3A2A1F',
    marginBottom: 4,
  },
  foodMacros: {
    fontSize: 14,
    color: '#9B8579',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkboxSelected: {
    backgroundColor: '#D68D54',
    borderColor: '#D68D54',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9B8579',
    fontSize: 14,
    fontStyle: 'italic',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 10,
  },
});

export default UnifiedFAB;
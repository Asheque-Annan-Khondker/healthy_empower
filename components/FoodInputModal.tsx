import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  BackHandler,
  Modal,
  FlatList,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Searchbar } from 'react-native-paper';
import { FoodDBModal } from '@/utils/dbFunctions';
import { Food } from '@/utils/table.types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Meal type options with icons
const mealTypes = [
  { id: 'breakfast', label: 'Breakfast', icon: 'wb-sunny', color: '#FFB347' },
  { id: 'lunch', label: 'Lunch', icon: 'restaurant', color: '#4CAF50' },
  { id: 'dinner', label: 'Dinner', icon: 'dinner-dining', color: '#FF7043' },
  { id: 'snack', label: 'Snack', icon: 'fastfood', color: '#AB47BC' },
];

interface FoodInputModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (foodEntry: any) => void;
  mode?: 'food' | 'meal';
}

const FoodInputModal: React.FC<FoodInputModalProps> = ({
  visible,
  onClose,
  onSave,
  mode = 'food'
}) => {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [time, setTime] = useState('');
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [availableFoods, setAvailableFoods] = useState<Food[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Mode toggle
  const [inputMode, setInputMode] = useState<'search' | 'manual'>('search');
  
  // Track if food was selected from search
  const [selectedFromSearch, setSelectedFromSearch] = useState(false);
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Set default time to current time
  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    setTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
  }, []);

  // Load available foods when modal opens
  useEffect(() => {
    if (visible) {
      loadAvailableFoods();
    }
  }, [visible]);

  // Show foods when switching to search mode
  useEffect(() => {
    if (inputMode === 'search' && availableFoods.length > 0) {
      setFilteredFoods(availableFoods);
      setShowSearchResults(true);
    }
  }, [inputMode, availableFoods]);

  const loadAvailableFoods = async () => {
    try {
      const foods = await FoodDBModal.get();
      setAvailableFoods(foods);
      console.log('🍎 FoodInputModal: Loaded', foods.length, 'available foods');
    } catch (error) {
      console.error('❌ FoodInputModal: Error loading foods:', error);
    }
  };

  // Filter foods based on search query - now works for both modes
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = availableFoods.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFoods(filtered);
      setShowSearchResults(true);
    } else if (inputMode === 'search') {
      // Show all foods when no search query in search mode
      setFilteredFoods(availableFoods);
      setShowSearchResults(true);
    } else {
      // Manual mode with no search query
      setFilteredFoods([]);
      setShowSearchResults(false);
    }
  }, [searchQuery, availableFoods, inputMode]);

  // Handle modal animations
  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 65,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Handle back button on Android
  useEffect(() => {
    if (visible && Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        onClose();
        return true;
      });
      return () => backHandler.remove();
    }
  }, [visible, onClose]);

  const handleSave = () => {
    // Validate inputs
    if (!foodName || !calories || !selectedMealType) {
      // Add haptic feedback or toast notification here
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
      foodId: selectedFoodId, // Include the selected food ID if available
    };

    onSave(foodEntry);
    resetForm();
  };

  const resetForm = () => {
    setFoodName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setSelectedMealType('');
    setSearchQuery('');
    setShowSearchResults(false);
    setInputMode('search');
    setSelectedFromSearch(false);
    setSelectedFoodId(null);
  };

  // Handle selecting a food from search results
  const handleSelectFood = (food: Food) => {
    setFoodName(food.name);
    setCalories(food.calories.toString());
    setProtein(food.protein.toString());
    setCarbs(food.carbs.toString());
    setFat(food.fat.toString());
    setSearchQuery('');
    setShowSearchResults(false);
    setSelectedFromSearch(true);
    setSelectedFoodId(food.food_id);
  };

  // Handle clearing selected food
  const handleClearSelection = () => {
    setFoodName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setSelectedFromSearch(false);
    setSelectedFoodId(null);
    if (inputMode === 'search') {
      setFilteredFoods(availableFoods);
      setShowSearchResults(true);
    }
  };


  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        {/* Blur Background */}
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <BlurView intensity={20} style={styles.blurView}>
            <TouchableOpacity style={styles.backdropTouch} onPress={handleClose} />
          </BlurView>
        </Animated.View>

        {/* Modal Content */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {/* Header with Gradient */}
          <LinearGradient
            colors={['#D68D54', '#B8702E']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {mode === 'food' ? 'Add New Food' : 'Log Meal'}
              </Text>
              <View style={styles.headerSpacer} />
            </View>
          </LinearGradient>

          {/* Form Content */}
          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {/* Mode Toggle Buttons */}
            <View style={styles.inputSection}>
              <View style={styles.modeToggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.modeToggleButton,
                    inputMode === 'search' && styles.activeModeToggleButton,
                  ]}
                  onPress={() => setInputMode('search')}
                >
                  <MaterialIcons 
                    name="search" 
                    size={20} 
                    color={inputMode === 'search' ? '#FFFFFF' : '#D68D54'} 
                  />
                  <Text
                    style={[
                      styles.modeToggleText,
                      inputMode === 'search' && styles.activeModeToggleText,
                    ]}
                  >
                    Search Foods
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.modeToggleButton,
                    inputMode === 'manual' && styles.activeModeToggleButton,
                  ]}
                  onPress={() => setInputMode('manual')}
                >
                  <MaterialIcons 
                    name="edit" 
                    size={20} 
                    color={inputMode === 'manual' ? '#FFFFFF' : '#D68D54'} 
                  />
                  <Text
                    style={[
                      styles.modeToggleText,
                      inputMode === 'manual' && styles.activeModeToggleText,
                    ]}
                  >
                    Manual Input
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Bar - Always Visible */}
            <View style={styles.inputSection}>
              <Searchbar
                placeholder="Search for existing foods..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
                iconColor="#D68D54"
                inputStyle={styles.searchInput}
              />
              
              {/* Search Results - Show in both modes */}
              {showSearchResults && (
                <View style={styles.searchResultsContainer}>
                  <ScrollView 
                    style={styles.searchResultsList}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                  >
                    {filteredFoods.length > 0 ? (
                      (inputMode === 'search' ? filteredFoods : filteredFoods.slice(0, 5)).map((item) => (
                        <TouchableOpacity
                          key={item.food_id.toString()}
                          style={styles.searchResultItem}
                          onPress={() => handleSelectFood(item)}
                        >
                          <View style={styles.searchResultContent}>
                            <Text style={styles.searchResultName}>{item.name}</Text>
                            <Text style={styles.searchResultMacros}>
                              {item.calories} cal • P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                            </Text>
                          </View>
                          <MaterialIcons 
                            name={inputMode === 'search' ? "arrow-forward-ios" : "content-copy"} 
                            size={16} 
                            color={inputMode === 'search' ? "#D68D54" : "#9CA3AF"} 
                          />
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text style={styles.noResultsText}>
                        {searchQuery ? `No foods found matching "${searchQuery}"` : 'No foods available'}
                      </Text>
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Food Details Section - Always Visible */}
            <View style={styles.inputSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {inputMode === 'search' ? 'Selected Food Details' : 'Food Details'}
                </Text>
                {selectedFromSearch && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={handleClearSelection}
                  >
                    <MaterialIcons name="clear" size={16} color="#EF4444" />
                    <Text style={styles.clearButtonText}>Clear</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.inputCard}>
                <Text style={styles.inputLabel}>Food Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={foodName}
                  onChangeText={setFoodName}
                  placeholder="e.g., Grilled Chicken Salad"
                  placeholderTextColor="#9B8579"
                  returnKeyType="next"
                  editable={inputMode === 'manual' || !selectedFromSearch}
                />
              </View>
            </View>

            {/* Nutrition Section */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Nutrition Info</Text>
              
              {/* Calories */}
              <View style={styles.inputCard}>
                <Text style={styles.inputLabel}>Calories *</Text>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={styles.textInput}
                    value={calories}
                    onChangeText={setCalories}
                    placeholder="350"
                    placeholderTextColor="#9B8579"
                    keyboardType="numeric"
                    returnKeyType="next"
                  />
                  <Text style={styles.inputUnit}>kcal</Text>
                </View>
              </View>

              {/* Macros Grid */}
              <View style={styles.macrosGrid}>
                <View style={styles.macroCard}>
                  <Text style={styles.macroLabel}>Protein</Text>
                  <View style={styles.macroInputContainer}>
                    <TextInput
                      style={styles.macroInput}
                      value={protein}
                      onChangeText={setProtein}
                      placeholder="0"
                      placeholderTextColor="#9B8579"
                      keyboardType="numeric"
                    />
                    <Text style={styles.macroUnit}>g</Text>
                  </View>
                </View>

                <View style={styles.macroCard}>
                  <Text style={styles.macroLabel}>Carbs</Text>
                  <View style={styles.macroInputContainer}>
                    <TextInput
                      style={styles.macroInput}
                      value={carbs}
                      onChangeText={setCarbs}
                      placeholder="0"
                      placeholderTextColor="#9B8579"
                      keyboardType="numeric"
                    />
                    <Text style={styles.macroUnit}>g</Text>
                  </View>
                </View>

                <View style={styles.macroCard}>
                  <Text style={styles.macroLabel}>Fat</Text>
                  <View style={styles.macroInputContainer}>
                    <TextInput
                      style={styles.macroInput}
                      value={fat}
                      onChangeText={setFat}
                      placeholder="0"
                      placeholderTextColor="#9B8579"
                      keyboardType="numeric"
                    />
                    <Text style={styles.macroUnit}>g</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Meal Type Section */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Meal Type *</Text>
              <View style={styles.mealTypesContainer}>
                {mealTypes.map((meal) => (
                  <TouchableOpacity
                    key={meal.id}
                    style={[
                      styles.mealTypeCard,
                      selectedMealType === meal.id && styles.selectedMealTypeCard,
                    ]}
                    onPress={() => setSelectedMealType(meal.id)}
                  >
                    <View style={[styles.mealTypeIcon, { backgroundColor: meal.color }]}>
                      <MaterialIcons name={meal.icon as any} size={20} color="#FFFFFF" />
                    </View>
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
            </View>

            {/* Time Section */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Time</Text>
              <View style={styles.inputCard}>
                <Text style={styles.inputLabel}>When did you eat this?</Text>
                <TextInput
                  style={styles.textInput}
                  value={time}
                  onChangeText={setTime}
                  placeholder="12:30 PM"
                  placeholderTextColor="#9B8579"
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonSection}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <LinearGradient
                  colors={['#D68D54', '#B8702E']}
                  style={styles.saveButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MaterialIcons name="check" size={20} color="#FFFFFF" style={styles.saveButtonIcon} />
                  <Text style={styles.saveButtonText}>Save Food</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  blurView: {
    flex: 1,
  },
  backdropTouch: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.9,
    minHeight: SCREEN_HEIGHT * 0.6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 40,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 12,
  },
  inputCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
    minHeight: 24,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputUnit: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
    marginLeft: 8,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  macroCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  macroInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroInput: {
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
    minWidth: 40,
    padding: 0,
  },
  macroUnit: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  mealTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mealTypeCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedMealTypeCard: {
    backgroundColor: '#FEF3E7',
    borderColor: '#D68D54',
  },
  mealTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mealTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    flex: 1,
  },
  selectedMealTypeText: {
    color: '#D68D54',
  },
  buttonSection: {
    flexDirection: 'row',
    marginTop: 32,
    paddingHorizontal: 4,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  saveButtonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 32,
  },
  searchBar: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    elevation: 0,
    shadowOpacity: 0,
  },
  searchInput: {
    fontSize: 16,
    color: '#1F2937',
  },
  searchResultsContainer: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 300,
    overflow: 'hidden',
  },
  searchResultsList: {
    flexGrow: 1,
    maxHeight: 280,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  searchResultMacros: {
    fontSize: 14,
    color: '#6B7280',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 8,
  },
  modeToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  activeModeToggleButton: {
    backgroundColor: '#D68D54',
    shadowColor: '#D68D54',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  modeToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D68D54',
    marginLeft: 8,
  },
  activeModeToggleText: {
    color: '#FFFFFF',
  },
  referenceContainer: {
    marginTop: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    maxHeight: 150,
    overflow: 'hidden',
  },
  referenceTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  referenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 4,
  },
});

export default FoodInputModal;

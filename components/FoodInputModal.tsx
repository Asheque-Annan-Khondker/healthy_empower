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
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!visible) return null;

  return (
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
            {/* Food Name Input */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Food Details</Text>
              <View style={styles.inputCard}>
                <Text style={styles.inputLabel}>Food Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={foodName}
                  onChangeText={setFoodName}
                  placeholder="e.g., Grilled Chicken Salad"
                  placeholderTextColor="#9B8579"
                  returnKeyType="next"
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
});

export default FoodInputModal;

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Alert } from 'react-native';
import FoodInputModal from './FoodInputModal';
import { FoodDBModal, MealLogDBModal } from '@/utils/dbFunctions';
import { getCurrentUser } from '@/utils/authState';

export interface FoodEntryBottomSheetRef {
  show: () => void;
  hide: () => void;
}

interface FoodEntryBottomSheetProps {
  onFoodAdded?: () => void;
  onMealAdded?: () => void;
}

const FoodEntryBottomSheet = forwardRef<FoodEntryBottomSheetRef, FoodEntryBottomSheetProps>(
  ({ onFoodAdded, onMealAdded }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    console.log('🍽️ FoodEntryBottomSheet: Rendered, visible:', isVisible);

    useImperativeHandle(ref, () => ({
      show: () => {
        console.log('📱 FoodEntryBottomSheet: Showing modal');
        setIsVisible(true);
      },
      hide: () => {
        console.log('📱 FoodEntryBottomSheet: Hiding modal');
        setIsVisible(false);
      },
    }));

    const handleClose = () => {
      console.log('❌ FoodEntryBottomSheet: Closing modal');
      setIsVisible(false);
    };

    const handleSave = async (foodEntry: any) => {
      console.log('💾 FoodEntryBottomSheet: Saving food entry:', foodEntry);
      try {
        // Get current user
        const user = await getCurrentUser();
        if (!user || !user.id) {
          console.error('❌ FoodEntryBottomSheet: No authenticated user found');
          return;
        }

        let foodId: number;

        // Check if a food was selected from existing foods or if we need to create a new one
        if (foodEntry.foodId) {
          // Use existing food ID
          foodId = foodEntry.foodId;
          console.log('✅ FoodEntryBottomSheet: Using existing food with ID:', foodId);
        } else {
          // Create new food entry in database
          const createdFood = await FoodDBModal.insert({
            name: foodEntry.name,
            calories: foodEntry.calories,
            protein: foodEntry.protein,
            carbs: foodEntry.carbs,
            fat: foodEntry.fat,
          });

          foodId = createdFood.food_id;
          console.log('✅ FoodEntryBottomSheet: Food inserted successfully with ID:', foodId);
        }

        // Create meal log entry using the food ID
        await MealLogDBModal.create({
          user_id: user.id,
          food_id: foodId,
          meal_type: foodEntry.mealType,
          servings: 1,
          logged_at: new Date().toISOString(),
        });

        console.log('✅ FoodEntryBottomSheet: Food entry saved successfully');
        setIsVisible(false);
        onFoodAdded?.();
        onMealAdded?.();
      } catch (error) {
        console.error('❌ FoodEntryBottomSheet: Error saving food entry:', error);
        
        // Show user-friendly error message
        Alert.alert(
          'Error Saving Food',
          error instanceof Error ? error.message : 'Failed to save food entry. Please try again.',
          [
            {
              text: 'Try Again',
              onPress: () => {
                // Keep modal open for retry
              }
            },
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {
                setIsVisible(false);
              }
            }
          ]
        );
      }
    };

    // Render FoodInputModal directly since it has its own modal implementation
    return (
      <FoodInputModal
        visible={isVisible}
        onClose={handleClose}
        onSave={handleSave}
        mode="food"
      />
    );
  }
);

FoodEntryBottomSheet.displayName = 'FoodEntryBottomSheet';

export default FoodEntryBottomSheet;

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import FoodInputModal from './FoodInputModal';
import { FoodDBModal, MealLogDBModal } from '@/utils/dbFunctions';
import { CURRENT_USER_ID } from '@/utils/authState';

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
        // Create new food entry in database
        await FoodDBModal.insert({
          name: foodEntry.name,
          calories: foodEntry.calories,
          protein: foodEntry.protein,
          carbs: foodEntry.carbs,
          fat: foodEntry.fat,
          meal_type: foodEntry.mealType,
        });

        // Create meal log entry
        await MealLogDBModal.create({
          user_id: CURRENT_USER_ID || 1,
          food_id: foodEntry.name, // Using name as ID for now
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

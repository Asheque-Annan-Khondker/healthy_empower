import axios from 'axios';
import { API_URL } from '@/constants/DBAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserId } from './authState';

export interface WorkoutCompletionResponse {
  message: string;
  reward_earned: number;
  streak_bonus: number;
  total_reward: number;
  current_streak: number;
  longest_streak: number;
  is_new_record: boolean;
  new_balance: number;
  workout_plan: string;
}

export interface ExerciseCompletion {
  exercise_id: number;
  sets_completed?: number;
  reps_completed?: number;
  duration?: number;
  notes?: string;
}

/**
 * Complete a workout plan and earn currency reward
 */
export const completeWorkoutPlan = async (
  planId: number,
  exercisesCompleted?: ExerciseCompletion[]
): Promise<WorkoutCompletionResponse> => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const apiUrl = await API_URL();
    const token = await AsyncStorage.getItem('authToken');
    
    const response = await axios.post<WorkoutCompletionResponse>(
      `${apiUrl}/api/users/${userId}/workout-logs/complete-plan`,
      {
        plan_id: planId,
        exercises_completed: exercisesCompleted
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Update local storage with new currency value
    await updateLocalUserCurrency(response.data.new_balance);

    // Notify listeners about currency update
    notifyCurrencyUpdate();

    return response.data;
  } catch (error) {
    console.error('Error completing workout plan:', error);
    throw error;
  }
};

/**
 * Update currency value in local AsyncStorage
 */
const updateLocalUserCurrency = async (newCurrency: number) => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      user.currency = newCurrency;
      await AsyncStorage.setItem('userData', JSON.stringify(user));
    }
  } catch (error) {
    console.error('Error updating local currency:', error);
  }
};

/**
 * Notify all currency listeners about updates
 */
const notifyCurrencyUpdate = () => {
  const listeners = (global as any).currencyUpdateListeners || [];
  listeners.forEach((listener: () => void) => {
    try {
      listener();
    } catch (error) {
      console.error('Error notifying currency listener:', error);
    }
  });
};

/**
 * Log a single workout exercise
 */
export const logWorkoutExercise = async (
  exerciseId: number,
  data: {
    sets_completed?: number;
    reps_completed?: number;
    duration?: number;
    notes?: string;
    completed_at?: Date;
  }
) => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const apiUrl = await API_URL();
    const token = await AsyncStorage.getItem('authToken');
    
    const response = await axios.post(
      `${apiUrl}/api/users/${userId}/workout-logs`,
      {
        exercise_id: exerciseId,
        ...data
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error logging workout exercise:', error);
    throw error;
  }
};
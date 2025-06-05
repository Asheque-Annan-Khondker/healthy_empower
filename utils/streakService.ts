import axios from 'axios';
import { API_URL } from '@/constants/DBAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserId } from './authState';

export interface StreakResponse {
  id: number;
  username: string;
  current_streak: number;
  longest_streak: number;
  last_workout_date: string | null;
  milestone: {
    current: {
      days: number;
      title: string;
      bonus: number;
    } | null;
    next: {
      days: number;
      title: string;
      bonus: number;
    } | null;
    progress: number;
  };
}

/**
 * Get current user's streak information
 */
export const getUserStreak = async (): Promise<StreakResponse> => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const apiUrl = await API_URL();
    const token = await AsyncStorage.getItem('authToken');
    
    const response = await axios.get<StreakResponse>(
      `${apiUrl}/api/users/${userId}/streak`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching user streak:', error);
    throw error;
  }
};

/**
 * Get streak milestone information for display
 */
export const getStreakMilestones = () => {
  return [
    { days: 3, title: "Getting Started", bonus: 2, emoji: "🌱" },
    { days: 7, title: "One Week Warrior", bonus: 5, emoji: "💪" },
    { days: 14, title: "Two Week Champion", bonus: 10, emoji: "🏆" },
    { days: 30, title: "Monthly Master", bonus: 20, emoji: "👑" },
    { days: 50, title: "Consistency King", bonus: 30, emoji: "🔥" },
    { days: 100, title: "Century Crusher", bonus: 50, emoji: "💎" }
  ];
};

/**
 * Format streak display text
 */
export const formatStreakText = (streak: number): string => {
  if (streak === 0) return "Start your streak!";
  if (streak === 1) return "1 day";
  return `${streak} days`;
};

/**
 * Get encouragement message based on streak
 */
export const getStreakEncouragement = (streak: number): string => {
  if (streak === 0) return "Complete a workout to start your streak!";
  if (streak < 3) return "Keep going! You're building momentum.";
  if (streak < 7) return "Great start! You're developing a habit.";
  if (streak < 14) return "Amazing! You're on fire! 🔥";
  if (streak < 30) return "Incredible consistency! You're a champion! 🏆";
  return "You're absolutely unstoppable! 💎";
};
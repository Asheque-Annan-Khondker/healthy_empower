// Centralized authentication state management
import AsyncStorage from '@react-native-async-storage/async-storage';

export let CURRENT_USER_ID: number | null = null;

/**
 * Get current user data from AsyncStorage
 */
export const getCurrentUser = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null; 
  } catch (error) {
    console.error('Error getting user data:', error);
    return null; 
  }
};

/**
 * Initialize user ID from stored authentication data
 * This should be called when the app starts and after login/signup
 */
export const initializeUserId = async (): Promise<number | null> => {
  try {
    const userData = await getCurrentUser();
    
    if (userData && userData.id) {
      CURRENT_USER_ID = userData.id;
      return CURRENT_USER_ID;
    } else {
      CURRENT_USER_ID = null;
      return null;
    }
  } catch (error) {
    console.error('❌ AuthState: Error initializing user ID:', error);
    CURRENT_USER_ID = null;
    return null;
  }
};

/**
 * Set the current user ID and update stored data if needed
 */
export const setUserId = (userId: number): void => {
  CURRENT_USER_ID = userId;
};

/**
 * Clear the current user ID (used during logout)
 */
export const clearUserId = (): void => {
  CURRENT_USER_ID = null;
};

/**
 * Get the current user ID
 * If not available in memory, try to initialize from storage
 */
export const getUserId = async (): Promise<number | null> => {
  if (CURRENT_USER_ID !== null) {
    return CURRENT_USER_ID;
  }
  
  // Try to initialize from storage
  return await initializeUserId();
};

/**
 * Get the current user ID synchronously (returns null if not available)
 */
export const getUserIdSync = (): number | null => {
  return CURRENT_USER_ID;
};

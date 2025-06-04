import axios from 'axios';
import { API_URL } from '@/constants/DBAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserId } from './authState';

export interface CurrencyResponse {
  id: number;
  username: string;
  currency: number;
}

export interface CurrencyUpdateResponse {
  message: string;
  currency: number;
}

/**
 * Get current user's currency balance
 */
export const getUserCurrency = async (): Promise<number> => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const apiUrl = await API_URL();
    const token = await AsyncStorage.getItem('authToken');
    
    const response = await axios.get<CurrencyResponse>(
      `${apiUrl}/api/users/${userId}/currency`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data.currency;
  } catch (error) {
    console.error('Error fetching user currency:', error);
    throw error;
  }
};

/**
 * Update user's currency (add or subtract)
 * @param amount - Positive number to add, negative to subtract
 */
export const updateUserCurrency = async (amount: number): Promise<number> => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const apiUrl = await API_URL();
    const token = await AsyncStorage.getItem('authToken');
    
    const response = await axios.patch<CurrencyUpdateResponse>(
      `${apiUrl}/api/users/${userId}/currency`,
      { amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Update local storage with new currency value
    await updateLocalUserCurrency(response.data.currency);

    // Notify listeners about currency update
    notifyCurrencyUpdate();

    return response.data.currency;
  } catch (error) {
    console.error('Error updating user currency:', error);
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
 * Add currency (convenience function)
 */
export const addCurrency = async (amount: number): Promise<number> => {
  if (amount < 0) {
    throw new Error('Amount must be positive');
  }
  return updateUserCurrency(amount);
};

/**
 * Subtract currency (convenience function)
 */
export const subtractCurrency = async (amount: number): Promise<number> => {
  if (amount < 0) {
    throw new Error('Amount must be positive');
  }
  return updateUserCurrency(-amount);
};

/**
 * Check if user has enough currency
 */
export const hasEnoughCurrency = async (requiredAmount: number): Promise<boolean> => {
  try {
    const currentBalance = await getUserCurrency();
    return currentBalance >= requiredAmount;
  } catch (error) {
    console.error('Error checking currency balance:', error);
    return false;
  }
};
import axios from 'axios';
import { API_URL } from '@/constants/DBAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserId } from './authState';
import { 
  regular_squirrel, 
  fitness_squirrel, 
  tennis_squirrel, 
  construction_squirrel, 
  doctor_squirrel 
} from '@/assets/images';

export interface UserCostumeData {
  user_id: number;
  costume_selected: string;
  owned_costumes?: string[];
}

export interface CostumeUpdateResponse {
  message: string;
  costume_selected: string;
}

/**
 * Get costume image by name
 */
export const getCostumeImage = (costumeName: string) => {
  const imageMap: { [key: string]: any } = {
    'Regular': regular_squirrel,
    'Fitness': fitness_squirrel,
    'Tennis': tennis_squirrel,
    'Construction': construction_squirrel,
    'Doctor': doctor_squirrel
  };
  return imageMap[costumeName] || regular_squirrel;
};

/**
 * Get current user's equipped costume
 */
export const getUserCostume = async (): Promise<string> => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return getUserCostumeById(userId);
  } catch (error) {
    console.error('Error fetching user costume:', error);
    return 'Regular'; // Default fallback
  }
};

/**
 * Get any user's equipped costume by user ID
 */
export const getUserCostumeById = async (userId: number | string): Promise<string> => {
  try {
    const apiUrl = await API_URL();
    const token = await AsyncStorage.getItem('authToken');
    
    const response = await axios.get<UserCostumeData>(
      `${apiUrl}/api/users/${userId}/costume`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data.costume_selected;
  } catch (error) {
    console.error(`Error fetching costume for user ${userId}:`, error);
    console.error('API URL:', await API_URL());
    console.error('Full error details:', error.response?.data || error.message);
    return 'Regular'; // Default fallback
  }
};

/**
 * Update user's equipped costume
 */
export const updateUserCostume = async (costumeName: string): Promise<string> => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const apiUrl = await API_URL();
    const token = await AsyncStorage.getItem('authToken');
    
    const response = await axios.patch<CostumeUpdateResponse>(
      `${apiUrl}/api/users/${userId}/costume`,
      { costume_selected: costumeName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Update local storage
    await updateLocalUserCostume(response.data.costume_selected);
    
    // Notify listeners about costume update
    notifyCostumeUpdate();

    return response.data.costume_selected;
  } catch (error) {
    console.error('Error updating user costume:', error);
    throw error;
  }
};

/**
 * Purchase and equip a costume
 */
export const purchaseCostume = async (costumeName: string, price: number): Promise<string> => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const apiUrl = await API_URL();
    const token = await AsyncStorage.getItem('authToken');
    
    const response = await axios.post<CostumeUpdateResponse>(
      `${apiUrl}/api/users/${userId}/costume/purchase`,
      { 
        costume_name: costumeName,
        price: price
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Update local storage
    await updateLocalUserCostume(response.data.costume_selected);
    
    // Notify listeners about costume update
    notifyCostumeUpdate();

    return response.data.costume_selected;
  } catch (error) {
    console.error('Error purchasing costume:', error);
    throw error;
  }
};

/**
 * Update costume value in local AsyncStorage
 */
const updateLocalUserCostume = async (newCostume: string) => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      user.costume_selected = newCostume;
      await AsyncStorage.setItem('userData', JSON.stringify(user));
    }
  } catch (error) {
    console.error('Error updating local costume:', error);
  }
};

/**
 * Notify all costume listeners about updates
 */
const notifyCostumeUpdate = () => {
  const listeners = (global as any).costumeUpdateListeners || [];
  listeners.forEach((listener: () => void) => {
    try {
      listener();
    } catch (error) {
      console.error('Error notifying costume listener:', error);
    }
  });
};

/**
 * Add costume update listener
 */
export const addCostumeUpdateListener = (listener: () => void) => {
  const listeners = (global as any).costumeUpdateListeners || [];
  listeners.push(listener);
  (global as any).costumeUpdateListeners = listeners;
};

/**
 * Remove costume update listener
 */
export const removeCostumeUpdateListener = (listener: () => void) => {
  const listeners = (global as any).costumeUpdateListeners || [];
  const index = listeners.indexOf(listener);
  if (index > -1) {
    listeners.splice(index, 1);
  }
};
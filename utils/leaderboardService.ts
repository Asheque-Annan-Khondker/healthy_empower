import axios from 'axios';
import { API_URL } from '@/constants/DBAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LeaderboardEntry {
  rank: number;
  id: number;
  username: string;
  currency: number;
  current_streak: number;
  longest_streak?: number;
}

export interface LeaderboardResponse {
  data: LeaderboardEntry[];
  timestamp: string;
  hash: string;
}

export interface LeaderboardState {
  data: LeaderboardEntry[];
  hash: string;
  lastUpdated: string;
}

export type LeaderboardType = 'currency' | 'streaks';

// In-memory cache for leaderboard data
const leaderboardCache = new Map<LeaderboardType, LeaderboardState>();

/**
 * Get leaderboard data ranked by currency with hash-based change detection
 */
export const getCurrencyLeaderboard = async (limit: number = 10): Promise<LeaderboardEntry[]> => {
  try {
    const apiUrl = await API_URL();
    const token = await AsyncStorage.getItem('authToken');
    
    const response = await axios.get<LeaderboardResponse>(
      `${apiUrl}/api/users/leaderboard/currency?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Log response for debugging and handle different response formats
    // console.log('Currency leaderboard response:', response.data);
    
    // Handle different possible response formats
    let responseData;
    if (response.data && response.data.data) {
      // Expected format: { data: [...], timestamp: ..., hash: ... }
      responseData = response.data.data;
    } else if (Array.isArray(response.data)) {
      // Direct array format: [...]
      responseData = response.data;
    } else {
      console.error('Unexpected response format:', response.data);
      throw new Error('Invalid response format from server');
    }

    // Cache the response
    leaderboardCache.set('currency', {
      data: responseData,
      hash: response.data.hash || 'no-hash',
      lastUpdated: response.data.timestamp || new Date().toISOString()
    });

    return responseData;
  } catch (error) {
    console.error('Error fetching currency leaderboard:', error);
    
    // Log more details about the error
    if (error.response) {
      console.error('Server responded with:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    
    // Return cached data if available
    const cached = leaderboardCache.get('currency');
    if (cached) {
      console.log('Returning cached currency leaderboard due to error');
      return cached.data;
    }
    
    throw error;
  }
};

/**
 * Get leaderboard data ranked by current streak with hash-based change detection
 */
export const getStreakLeaderboard = async (limit: number = 10): Promise<LeaderboardEntry[]> => {
  try {
    const apiUrl = await API_URL();
    const token = await AsyncStorage.getItem('authToken');
    
    const response = await axios.get<LeaderboardResponse>(
      `${apiUrl}/api/users/leaderboard/streaks?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Log response for debugging and handle different response formats
    // console.log('Streak leaderboard response:', response.data);
    
    // Handle different possible response formats
    let responseData;
    if (response.data && response.data.data) {
      // Expected format: { data: [...], timestamp: ..., hash: ... }
      responseData = response.data.data;
    } else if (Array.isArray(response.data)) {
      // Direct array format: [...]
      responseData = response.data;
    } else {
      console.error('Unexpected response format:', response.data);
      throw new Error('Invalid response format from server');
    }

    // Cache the response
    leaderboardCache.set('streaks', {
      data: responseData,
      hash: response.data.hash || 'no-hash',
      lastUpdated: response.data.timestamp || new Date().toISOString()
    });

    return responseData;
  } catch (error) {
    console.error('Error fetching streak leaderboard:', error);
    
    // Log more details about the error
    if (error.response) {
      console.error('Server responded with:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    
    // Return cached data if available
    const cached = leaderboardCache.get('streaks');
    if (cached) {
      console.log('Returning cached streak leaderboard due to error');
      return cached.data;
    }
    
    throw error;
  }
};

/**
 * Check if leaderboard data has changed without fetching full data
 */
export const hasLeaderboardChanged = async (type: LeaderboardType, limit: number = 10): Promise<boolean> => {
  try {
    const cached = leaderboardCache.get(type);
    if (!cached) {
      return true; // No cache, definitely changed
    }

    const apiUrl = await API_URL();
    const token = await AsyncStorage.getItem('authToken');
    const endpoint = type === 'currency' ? 'currency' : 'streaks';
    
    const response = await axios.get<LeaderboardResponse>(
      `${apiUrl}/api/users/leaderboard/${endpoint}?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data.hash !== cached.hash;
  } catch (error) {
    console.error('Error checking leaderboard changes:', error);
    return false; // On error, don't trigger unnecessary updates
  }
};

/**
 * Get cached leaderboard data
 */
export const getCachedLeaderboard = (type: LeaderboardType): LeaderboardEntry[] | null => {
  const cached = leaderboardCache.get(type);
  return cached ? cached.data : null;
};

/**
 * Get leaderboard data by type with hash-based optimization
 */
export const getLeaderboard = async (type: LeaderboardType, limit: number = 10, forceRefresh: boolean = false): Promise<LeaderboardEntry[]> => {
  // If not forcing refresh, check if data has changed
  if (!forceRefresh) {
    const hasChanged = await hasLeaderboardChanged(type, limit);
    if (!hasChanged) {
      const cached = getCachedLeaderboard(type);
      if (cached) {
        console.log(`Returning cached ${type} leaderboard (no changes detected)`);
        return cached;
      }
    }
  }

  // Fetch fresh data
  if (type === 'currency') {
    return getCurrencyLeaderboard(limit);
  } else {
    return getStreakLeaderboard(limit);
  }
};

/**
 * Clear all cached leaderboard data
 */
export const clearLeaderboardCache = (): void => {
  leaderboardCache.clear();
};

/**
 * Get cache information for debugging
 */
export const getLeaderboardCacheInfo = (): { type: LeaderboardType; lastUpdated: string; dataLength: number }[] => {
  const info: { type: LeaderboardType; lastUpdated: string; dataLength: number }[] = [];
  
  for (const [type, state] of leaderboardCache.entries()) {
    info.push({
      type,
      lastUpdated: state.lastUpdated,
      dataLength: state.data.length
    });
  }
  
  return info;
};
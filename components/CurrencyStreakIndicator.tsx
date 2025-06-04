import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, AppState } from 'react-native';
import { getUserCurrency } from '@/utils/currencyService';
import { getUserStreak } from '@/utils/streakService';

interface CurrencyStreakIndicatorProps {
  refreshKey?: number;
}

const CurrencyStreakIndicator: React.FC<CurrencyStreakIndicatorProps> = ({ refreshKey = 0 }) => {
  const [currency, setCurrency] = useState<number | null>(null);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    // Set up periodic refresh every 15 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Refresh when refreshKey changes (when screen comes into focus)
  useEffect(() => {
    if (refreshKey > 0) {
      fetchData();
    }
  }, [refreshKey]);

  // Refresh when app comes back from background
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        fetchData();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription?.remove();
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [currencyData, streakData] = await Promise.all([
        getUserCurrency(),
        getUserStreak()
      ]);
      console.log('CurrencyStreakIndicator - Currency:', currencyData);
      console.log('CurrencyStreakIndicator - Streak Data:', streakData);
      setCurrency(currencyData);
      setStreakDays(streakData.current_streak);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setCurrency(0);
      setStreakDays(0);
    } finally {
      setLoading(false);
    }
  };

  // Public method to refresh data
  const refreshData = async () => {
    await fetchData();
  };

  // Listen for currency updates
  useEffect(() => {
    const handleDataUpdate = () => {
      fetchData();
    };

    // Add event listener for data updates
    const subscription = global.currencyUpdateListeners || [];
    subscription.push(handleDataUpdate);
    global.currencyUpdateListeners = subscription;

    return () => {
      // Remove listener on cleanup
      const listeners = global.currencyUpdateListeners || [];
      const index = listeners.indexOf(handleDataUpdate);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.fireEmoji}>🔥</Text>
        <Text style={styles.streakText}>{streakDays}</Text>
      </View>
      
      <Text style={styles.divider}>|</Text>
      
      <View style={styles.rightSection}>
        {loading ? (
          <ActivityIndicator size="small" color="#D68D54" />
        ) : (
          <>
            <Text style={styles.currencyText}>{currency || 0}</Text>
            <Text style={styles.chestnutEmoji}>🌰</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    width: 'auto',
    alignSelf: 'flex-end',
    marginRight: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  divider: {
    color: '#ddd',
    fontSize: 16,
    fontWeight: '200',
  },
  fireEmoji: {
    fontSize: 14,
    marginRight: 3,
  },
  streakText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  currencyText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginRight: 3,
  },
  chestnutEmoji: {
    fontSize: 14,
  }
});

export default CurrencyStreakIndicator;
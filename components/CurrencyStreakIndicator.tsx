import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, AppState } from 'react-native';
import { getUserCurrency } from '@/utils/currencyService';

interface CurrencyStreakIndicatorProps {
  streakDays?: number;
  refreshKey?: number;
}

const CurrencyStreakIndicator: React.FC<CurrencyStreakIndicatorProps> = ({ streakDays = 0, refreshKey = 0 }) => {
  const [currency, setCurrency] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrency();
    
    // Set up periodic refresh every 15 seconds
    const interval = setInterval(() => {
      fetchCurrency();
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Refresh when refreshKey changes (when screen comes into focus)
  useEffect(() => {
    if (refreshKey > 0) {
      fetchCurrency();
    }
  }, [refreshKey]);

  // Refresh when app comes back from background
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        fetchCurrency();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription?.remove();
    };
  }, []);

  const fetchCurrency = async () => {
    try {
      setLoading(true);
      const balance = await getUserCurrency();
      setCurrency(balance);
    } catch (err) {
      console.error('Failed to fetch currency:', err);
      setCurrency(0);
    } finally {
      setLoading(false);
    }
  };

  // Public method to refresh currency
  const refreshCurrency = async () => {
    await fetchCurrency();
  };

  // Listen for currency updates
  useEffect(() => {
    const handleCurrencyUpdate = () => {
      fetchCurrency();
    };

    // Add event listener for currency updates
    const subscription = global.currencyUpdateListeners || [];
    subscription.push(handleCurrencyUpdate);
    global.currencyUpdateListeners = subscription;

    return () => {
      // Remove listener on cleanup
      const listeners = global.currencyUpdateListeners || [];
      const index = listeners.indexOf(handleCurrencyUpdate);
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
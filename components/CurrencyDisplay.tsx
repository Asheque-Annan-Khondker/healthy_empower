import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserCurrency } from '@/utils/currencyService';

interface CurrencyDisplayProps {
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  style?: any;
  onPress?: () => void;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({ 
  size = 'medium', 
  showIcon = true,
  style,
  onPress 
}) => {
  const [currency, setCurrency] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchCurrency();
  }, []);

  const fetchCurrency = async () => {
    try {
      setLoading(true);
      setError(false);
      const balance = await getUserCurrency();
      setCurrency(balance);
    } catch (err) {
      console.error('Failed to fetch currency:', err);
      setError(true);
      setCurrency(0);
    } finally {
      setLoading(false);
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: 14,
          iconSize: 16,
          padding: 4,
        };
      case 'large':
        return {
          fontSize: 24,
          iconSize: 28,
          padding: 12,
        };
      default:
        return {
          fontSize: 18,
          iconSize: 20,
          padding: 8,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  if (loading) {
    return (
      <View style={[styles.container, { padding: sizeStyles.padding }, style]}>
        <ActivityIndicator size="small" color="#D68D54" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { padding: sizeStyles.padding }, style]}>
      {showIcon && (
        <Ionicons 
          name="cash-outline" 
          size={sizeStyles.iconSize} 
          color="#D68D54" 
          style={styles.icon}
        />
      )}
      <Text style={[styles.currencyText, { fontSize: sizeStyles.fontSize }]}>
        {currency !== null ? currency.toLocaleString() : '0'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(214, 141, 84, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 6,
  },
  currencyText: {
    color: '#3A2A1F',
    fontWeight: '600',
  },
});
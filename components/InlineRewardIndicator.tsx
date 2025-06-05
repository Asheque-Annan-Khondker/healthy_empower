import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface InlineRewardIndicatorProps {
  reward: number;
  size?: 'small' | 'medium';
  style?: any;
}

export const InlineRewardIndicator: React.FC<InlineRewardIndicatorProps> = ({ 
  reward, 
  size = 'small',
  style 
}) => {
  const isSmall = size === 'small';
  
  return (
    <View style={[styles.container, style]}>
      <Text style={[
        styles.text,
        {
          fontSize: isSmall ? 12 : 14,
        }
      ]}>
        Earn +{reward} 🌰
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(214, 141, 84, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#B25B28',
    fontWeight: '600',
  },
});
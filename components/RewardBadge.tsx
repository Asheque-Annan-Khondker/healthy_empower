import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface RewardBadgeProps {
  reward: number;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export const RewardBadge: React.FC<RewardBadgeProps> = ({ 
  reward, 
  size = 'medium',
  style 
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: 6,
          paddingVertical: 3,
          fontSize: 12,
          iconSize: 12,
          borderRadius: 12,
        };
      case 'large':
        return {
          paddingHorizontal: 12,
          paddingVertical: 6,
          fontSize: 16,
          iconSize: 16,
          borderRadius: 20,
        };
      default:
        return {
          paddingHorizontal: 8,
          paddingVertical: 4,
          fontSize: 14,
          iconSize: 14,
          borderRadius: 16,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={['#D68D54', '#B25B28']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          {
            paddingHorizontal: sizeStyles.paddingHorizontal,
            paddingVertical: sizeStyles.paddingVertical,
            borderRadius: sizeStyles.borderRadius,
          }
        ]}
      >
        <Text style={[styles.rewardText, { fontSize: sizeStyles.fontSize }]}>
          +{reward}
        </Text>
        <Text style={[styles.acornIcon, { fontSize: sizeStyles.iconSize }]}>
          🌰
        </Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  rewardText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 4,
  },
  acornIcon: {
    // No additional styles needed
  },
});
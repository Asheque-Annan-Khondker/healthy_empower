import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { getUserCostume, getUserCostumeById, getCostumeImage, addCostumeUpdateListener, removeCostumeUpdateListener } from '@/utils/costumeService';

interface ProfileAvatarProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  style?: any;
  borderColor?: string;
  borderWidth?: number;
  showBorder?: boolean;
  userId?: number | string; // Optional userId - if not provided, uses current user
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
  size = 'medium',
  style,
  borderColor = '#D68D54',
  borderWidth = 2,
  showBorder = true,
  userId
}) => {
  const [costume, setCostume] = useState<string>('Regular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCostume();
    
    // Only listen for costume updates if this is for the current user (no userId specified)
    if (!userId) {
      const handleCostumeUpdate = () => {
        fetchCostume();
      };
      
      addCostumeUpdateListener(handleCostumeUpdate);
      
      return () => {
        removeCostumeUpdateListener(handleCostumeUpdate);
      };
    }
  }, [userId]);

  const fetchCostume = async () => {
    try {
      setLoading(true);
      const userCostume = userId ? 
        await getUserCostumeById(userId) : 
        await getUserCostume();
      setCostume(userCostume);
    } catch (error) {
      console.error('Failed to fetch user costume:', error);
      setCostume('Regular'); // Fallback to default
    } finally {
      setLoading(false);
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 32,
          height: 32,
          borderRadius: 16,
        };
      case 'medium':
        return {
          width: 48,
          height: 48,
          borderRadius: 24,
        };
      case 'large':
        return {
          width: 64,
          height: 64,
          borderRadius: 32,
        };
      case 'xlarge':
        return {
          width: 96,
          height: 96,
          borderRadius: 48,
        };
      default:
        return {
          width: 48,
          height: 48,
          borderRadius: 24,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const borderStyle = showBorder ? {
    borderWidth: borderWidth,
    borderColor: borderColor,
  } : {};

  if (loading) {
    return (
      <View style={[
        styles.container,
        sizeStyles,
        borderStyle,
        style
      ]}>
        <ActivityIndicator size="small" color={borderColor} />
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      sizeStyles,
      borderStyle,
      style
    ]}>
      <Image 
        source={getCostumeImage(costume)}
        style={[styles.image, sizeStyles]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
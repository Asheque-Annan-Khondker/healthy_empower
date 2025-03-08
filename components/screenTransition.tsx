import { useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withSpring,
  WithTimingConfig
} from 'react-native-reanimated';

export type TransitionType = 'slide' | 'fade' | 'zoom' | 'bounce';
export type SlideDirection = 'left' | 'right' | 'top' | 'bottom';

interface ScreenTransitionProps {
  children: React.ReactNode;
  type?: TransitionType;
  duration?: number;
  delay?: number;
  slideDirection?: SlideDirection;
}

export default function ScreenTransition({ 
  children, 
  type = 'slide',
  duration = 800,
  delay = 0,
  slideDirection = 'right'
}: ScreenTransitionProps) {
  // animation shared values
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.9);
  
  // animation config
  const timingConfig: WithTimingConfig = {
    duration,
    easing: Easing.bezier(0.25, 1, 0.5, 1),
  };

  // initial animation values based on type and direction
  const setInitialValues = () => {
    // direction-specific initial values
    if (type === 'slide') {
      switch (slideDirection) {
        case 'left':
          translateX.value = -100;
          break;
        case 'right':
          translateX.value = 100;
          break;
        case 'top':
          translateY.value = -100;
          break;
        case 'bottom':
          translateY.value = 100;
          break;
      }
    } else if (type === 'fade') {
      opacity.value = 0;
    } else if (type === 'zoom' || type === 'bounce') {
      scale.value = 0.9;
      opacity.value = 0;
    }
  };
  
  // Start animations with specified delay
  const startAnimations = () => {
    const animationTimeout = setTimeout(() => {
      opacity.value = withTiming(1, timingConfig);
      
      if (type === 'slide') {
        translateX.value = withTiming(0, timingConfig);
        translateY.value = withTiming(0, timingConfig);
      }
      
      if (type === 'zoom' || type === 'bounce') {
        scale.value = type === 'bounce' 
          ? withSpring(1, { damping: 8, stiffness: 150 })
          : withTiming(1, timingConfig);
      }
    }, delay);
    
    return animationTimeout;
  };

  // Every Screen transition, components are reanimated
  useFocusEffect(
    useCallback(() => {
      setInitialValues();
      
      const animationTimeout = startAnimations();

      // Cleanup
      return () => {
        clearTimeout(animationTimeout);
      };
    }, [type, slideDirection, delay])
  );

  // animated styles
  const animatedStyles = useAnimatedStyle(() => {
    const baseStyles = {
      flex: 1,
      opacity: type === 'fade' || type === 'zoom' || type === 'bounce' ? opacity.value : 1,
    };
    
    if (type === 'slide') {
      return {
        ...baseStyles,
        opacity: opacity.value,
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value }
        ],
      };
    } else if (type === 'zoom' || type === 'bounce') {
      return {
        ...baseStyles,
        transform: [{ scale: scale.value }],
      };
    } else {
      return baseStyles;
    }
  });

  return (
    <Animated.View style={[styles.container, animatedStyles]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
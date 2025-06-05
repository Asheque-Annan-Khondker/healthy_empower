import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { width } = Dimensions.get('window');

interface MacroRingsProps {
  protein: { current: number; target: number };
  carbs: { current: number; target: number };
  fats: { current: number; target: number };
}

const MacroRing = ({ 
  percentage, 
  color, 
  label, 
  current, 
  target, 
  size = 80 
}: {
  percentage: number;
  color: string;
  label: string;
  current: number;
  target: number;
  size?: number;
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[styles.ringContainer, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#F0F0F0"
          strokeWidth="8"
          fill="transparent"
        />        {/* Progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      {/* Center content */}
      <View style={styles.ringCenter}>
        <Text style={[styles.percentageText, { color }]}>
          {Math.round(percentage)}%
        </Text>
      </View>
      
      {/* Label and values */}
      <View style={styles.ringInfo}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValues}>
          {Math.round(current)}g / {target}g
        </Text>
      </View>
    </View>
  );
};

export default function MacroRings({ protein, carbs, fats }: MacroRingsProps) {
  const proteinPercentage = Math.min((protein.current / protein.target) * 100, 100);
  const carbsPercentage = Math.min((carbs.current / carbs.target) * 100, 100);
  const fatsPercentage = Math.min((fats.current / fats.target) * 100, 100);

  console.log('🔍 MacroRings Debug - Received data:', {
    protein: { current: protein.current, target: protein.target, percentage: proteinPercentage },
    carbs: { current: carbs.current, target: carbs.target, percentage: carbsPercentage },
    fats: { current: fats.current, target: fats.target, percentage: fatsPercentage }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Today's Macros</Text>
      <Text style={styles.subtitle}>Track your daily nutrition goals</Text>
      <View style={styles.ringsRow}>
        <MacroRing
          percentage={proteinPercentage}
          color="#E74C3C"
          label="💪 Protein"
          current={protein.current}
          target={protein.target}
        />
        <MacroRing
          percentage={carbsPercentage}
          color="#3498DB"
          label="⚡ Carbs"
          current={carbs.current}
          target={carbs.target}
        />
        <MacroRing
          percentage={fatsPercentage}
          color="#F39C12"
          label="🥑 Fats"
          current={fats.current}
          target={fats.target}
        />
      </View>
      
      {/* Progress Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          💯 Overall Progress: {Math.round((proteinPercentage + carbsPercentage + fatsPercentage) / 3)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A2A1F',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9B8579',
    textAlign: 'center',
    marginBottom: 20,
  },
  ringsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  ringContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  ringCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -10 }],
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 20,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  ringInfo: {
    marginTop: 90,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A2A1F',
    marginBottom: 4,
  },
  macroValues: {
    fontSize: 12,
    color: '#666',
  },
  summaryContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(214, 141, 84, 0.2)',
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A2A1F',
    textAlign: 'center',
  },
});

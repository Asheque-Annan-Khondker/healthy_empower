import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface WeeklyScoreProps {
  score: number;
  balancedDays: number;
  totalDays: number;
  trend: 'up' | 'down' | 'stable';
}

export default function WeeklyNutritionScore({ 
  score, 
  balancedDays, 
  totalDays, 
  trend 
}: WeeklyScoreProps) {
  const animatedScore = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // Add listener to update display score
    const listenerId = animatedScore.addListener(({ value }) => {
      setDisplayScore(Math.round(value));
    });

    // Animate score counting up
    Animated.timing(animatedScore, {
      toValue: score,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Pulse animation for the score
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Cleanup listener
    return () => {
      animatedScore.removeListener(listenerId);
    };
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#27AE60';
    if (score >= 60) return '#F39C12';
    return '#E74C3C';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🌟';
    if (score >= 80) return '🎯';
    if (score >= 70) return '👍';
    if (score >= 60) return '📈';
    return '💪';
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <MaterialIcons name="trending-up" size={20} color="#27AE60" />;
      case 'down':
        return <MaterialIcons name="trending-down" size={20} color="#E74C3C" />;
      default:
        return <MaterialIcons name="trending-flat" size={20} color="#95A5A6" />;
    }
  };

  const scoreColor = getScoreColor(score);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>This Week's Nutrition</Text>
      </View>
      
      <Animated.View 
        style={[
          styles.scoreContainer,
          { transform: [{ scale: pulseAnimation }] }
        ]}
      >
        <Text style={styles.emoji}>{getScoreEmoji(score)}</Text>        <Text style={[styles.scoreText, { color: scoreColor }]}>
          {displayScore}%
        </Text>
        <Text style={styles.scoreLabel}>Balanced</Text>
      </Animated.View>

      <View style={styles.detailsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{balancedDays}</Text>
          <Text style={styles.statLabel}>Balanced Days</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalDays}</Text>
          <Text style={styles.statLabel}>Total Days</Text>
        </View>

      </View>      <View style={styles.progressBar}>        <Animated.View 
          style={[
            styles.progressFill,
            { 
              width: animatedScore.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', `${displayScore}%`],
                extrapolate: 'clamp',
              }),
              backgroundColor: scoreColor,
            }
          ]} 
        />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A2A1F',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3A2A1F',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});

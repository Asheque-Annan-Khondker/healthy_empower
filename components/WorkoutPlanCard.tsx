import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RewardBadge } from './RewardBadge';

const { width: screenWidth } = Dimensions.get('window');

interface WorkoutPlanCardProps {
  planId: number;
  name: string;
  description: string;
  difficultyLevel: string;
  reward: number;
  exerciseCount?: number;
  onPress?: () => void;
  onComplete?: () => void;
}

export const WorkoutPlanCard: React.FC<WorkoutPlanCardProps> = ({
  planId,
  name,
  description,
  difficultyLevel,
  reward,
  exerciseCount,
  onPress,
  onComplete
}) => {
  const getDifficultyColor = () => {
    switch (difficultyLevel?.toLowerCase()) {
      case 'beginner':
        return '#4CAF50';
      case 'intermediate':
        return '#FF9800';
      case 'expert':
      case 'advanced':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getDifficultyIcon = () => {
    switch (difficultyLevel?.toLowerCase()) {
      case 'beginner':
        return 'leaf';
      case 'intermediate':
        return 'fitness';
      case 'expert':
      case 'advanced':
        return 'flame';
      default:
        return 'help-circle';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={['#FFFFFF', '#F8F8F8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Header with reward badge */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>{name}</Text>
            <View style={styles.difficultyContainer}>
              <Ionicons 
                name={getDifficultyIcon() as any} 
                size={14} 
                color={getDifficultyColor()} 
              />
              <Text style={[styles.difficulty, { color: getDifficultyColor() }]}>
                {difficultyLevel}
              </Text>
            </View>
          </View>
          <RewardBadge reward={reward} size="small" />
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.exerciseInfo}>
            {exerciseCount && (
              <>
                <Ionicons name="list" size={16} color="#9B8579" />
                <Text style={styles.exerciseCount}>
                  {exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''}
                </Text>
              </>
            )}
          </View>
          
          <View style={styles.actionButtons}>
            {onComplete && (
              <TouchableOpacity 
                style={styles.completeButton}
                onPress={onComplete}
                activeOpacity={0.7}
              >
                <Text style={styles.completeButtonText}>Complete</Text>
                <Text style={styles.rewardText}>+{reward}🌰</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(214, 141, 84, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 4,
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficulty: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: '#6B5C53',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseCount: {
    fontSize: 12,
    color: '#9B8579',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#D68D54',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  rewardText: {
    fontSize: 11,
    color: 'white',
    fontWeight: 'bold',
  },
});
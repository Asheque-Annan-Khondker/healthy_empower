import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { WorkoutPlanCard } from '../WorkoutPlanCard';
import { WorkoutCompletionModal } from '../WorkoutCompletionModal';
import { completeWorkoutPlan } from '@/utils/workoutService';
import { WorkoutPlan } from '@/Context/WorkoutContext';

interface WorkoutPlanListProps {
  workoutPlans: WorkoutPlan[];
  loading?: boolean;
  onPlanPress?: (plan: WorkoutPlan) => void;
}

export const WorkoutPlanList: React.FC<WorkoutPlanListProps> = ({
  workoutPlans,
  loading = false,
  onPlanPress
}) => {
  const [completionModal, setCompletionModal] = useState<{
    visible: boolean;
    workoutName: string;
    rewardEarned: number;
    newBalance: number;
  }>({
    visible: false,
    workoutName: '',
    rewardEarned: 0,
    newBalance: 0
  });

  const handleCompleteWorkout = async (plan: WorkoutPlan) => {
    try {
      const result = await completeWorkoutPlan(plan.plan_id);
      
      setCompletionModal({
        visible: true,
        workoutName: result.workout_plan,
        rewardEarned: result.reward_earned,
        newBalance: result.new_balance
      });
    } catch (error) {
      console.error('Error completing workout:', error);
      Alert.alert(
        'Error',
        'Failed to complete workout. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const closeModal = () => {
    setCompletionModal({
      visible: false,
      workoutName: '',
      rewardEarned: 0,
      newBalance: 0
    });
  };

  const renderWorkoutPlan = ({ item }: { item: WorkoutPlan }) => (
    <WorkoutPlanCard
      planId={item.plan_id}
      name={item.name}
      description={item.description}
      difficultyLevel={item.difficulty_level}
      reward={item.reward}
      exerciseCount={item.Exercises?.length}
      onPress={() => onPlanPress?.(item)}
      onComplete={() => handleCompleteWorkout(item)}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D68D54" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={workoutPlans}
        renderItem={renderWorkoutPlan}
        keyExtractor={(item) => item.plan_id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
      
      <WorkoutCompletionModal
        visible={completionModal.visible}
        onClose={closeModal}
        workoutName={completionModal.workoutName}
        rewardEarned={completionModal.rewardEarned}
        newBalance={completionModal.newBalance}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
});
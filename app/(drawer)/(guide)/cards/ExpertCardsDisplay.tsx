import * as React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { WorkoutPlanDBModal } from '@/utils/dbFunctions';
import { WorkoutPlan } from '@/utils/table.types';
import PlaceCard from '@/components/PlaceCard';

const ExpertCardsDisplay = () => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpertWorkouts = async () => {
      try {
        setLoading(true);
        // Fetch workout plans with 'advanced' difficulty level
        const plans = await WorkoutPlanDBModal.get({
          difficulty_level: { eq: 'advanced' }
        });
        setWorkoutPlans(plans);
      } catch (error) {
        console.error('Error fetching expert workouts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpertWorkouts();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        
        {/* Tips Disclaimer */}
        <Card style={styles.disclaimerCard}>
          <Card.Content>
            <Text style={styles.disclaimerText}>
              ⚡ <Text style={styles.boldText}>Elite level training!</Text> Master periodization, track macros precisely, and prioritize recovery for peak performance!
            </Text>
          </Card.Content>
        </Card>

        {/* Workout Cards */}
        {loading ? (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="bodyMedium">Loading expert workouts...</Text>
            </Card.Content>
          </Card>
        ) : workoutPlans.length > 0 ? (
          workoutPlans.map((plan, index) => (
            <TouchableOpacity 
              key={plan.plan_id}
              onPress={() => router.push({
                pathname: '/guideContent',
                params: { work_id: plan.plan_id }
              })}
              activeOpacity={0.8}
            >
              <PlaceCard 
                title={plan.name}
                subtext={plan.description || "Push your limits with this expert-level workout"}
                leftBottomText="45-60 min"
                tag="Advanced" 
                image={require('@/assets/images/gym.png')}
                reward={plan.reward}
              />
            </TouchableOpacity>
          ))
        ) : (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="bodyMedium">
                No expert workouts found in the database yet. Check back soon for elite-level workout plans!
              </Text>
            </Card.Content>
          </Card>
        )}


      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 16,
  },
  container: {
    paddingHorizontal: 0,
    marginLeft: -10, // Move cards to the left by 10px
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 3,
    borderRadius: 10,
  },
  disclaimerCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 1,
    borderRadius: 10,
    backgroundColor: '#000000',
  },
  disclaimerText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default ExpertCardsDisplay;
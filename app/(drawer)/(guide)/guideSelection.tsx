import React from 'react';
import {useCallback, useRef} from 'react';
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useFocusEffect} from "expo-router";
import { Button } from 'react-native-paper';
import PlaceCard from "@/components/PlaceCard";
import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Updated WorkoutPlan interface to match backend model
interface Exercise {
  exercise_id: number;
  name: string;
  description?: string;
  type: string;
  measurement_type: string;
  difficulty_level?: string;
  target_muscle_group?: string;
  WorkoutPlanExercise?: {
    sets?: number;
    reps_targets?: number;
    duration?: number;
  };
}

interface WorkoutPlan {
  plan_id: number;
  name: string;
  description: string;
  difficulty_level: string;
  created_at: string;
  Exercises?: Exercise[];
}

import { WorkoutPlanDBModal } from '@/utils/dbFunctions';

export default function GuideSelection() {
  const [guideList, setGuideList] = useState<WorkoutPlan[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<WorkoutPlan | null>(null);
  const [selectedPlanExercises, setSelectedPlanExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingExercises, setIsLoadingExercises] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  async function fetchData(){
    setIsLoading(true);
    try {
      const response = await WorkoutPlanDBModal.get();
      if (Array.isArray(response) && response.length > 0) {
        setGuideList(response);
      } else {
        console.warn("No workout plans returned from API");
        setGuideList([]);
      }
    } catch (error) {
      console.error("Error fetching guides:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Function to fetch exercises for a specific plan
  async function fetchPlanDetails(planId: number) {
    setIsLoadingExercises(true);
    try {
      const planDetails = await WorkoutPlanDBModal.getById(planId);
      if (planDetails && planDetails.Exercises) {
        setSelectedPlanExercises(planDetails.Exercises);
      } else {
        setSelectedPlanExercises([]);
      }
    } catch (error) {
      console.error(`Error fetching exercises for plan ${planId}:`, error);
      setSelectedPlanExercises([]);
    } finally {
      setIsLoadingExercises(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData()
      return () =>{
        console.log("Refreshing Achievements")
      }
    }, [])
  )

  useEffect(()=>{
    console.log("Guide List", guideList);
  }, [guideList])

  const handleGuideSelect = (guide: WorkoutPlan) => {
    setSelectedGuide(guide);
    if (guide.plan_id) {
      fetchPlanDetails(guide.plan_id);
    }
    bottomSheetRef.current?.snapToIndex(1);
  }
  
  const handleStartButton = () => {
    bottomSheetRef.current?.close();
    if (selectedGuide?.plan_id) {
      // Store selected exercises in AsyncStorage or similar if needed
      // For now, just pass the workout ID
      router.push({
        pathname: '/guideContent', 
        params: { work_id: selectedGuide.plan_id }
      });
    } else {
      console.error("Cannot start guide: no plan_id available");
    }
  }

  const handleSheetChanges = useCallback((index: number)=>{
    console.log(`SheetChanges: ${index}`);
  }, [])

  const renderModal = () => (
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>{selectedGuide?.name}</Text>
      <View style={styles.difficultyBadge}>
        <Text style={styles.difficultyText}>Difficulty: {selectedGuide?.difficulty_level}</Text>
      </View>
      <Text style={styles.modalDescription}>{selectedGuide?.description}</Text>
      
      {selectedPlanExercises.length > 0 && (
        <>
          <Text style={styles.modalStepsTitle}>Exercises:</Text>
          <ScrollView style={styles.stepsContainer}>
            {isLoadingExercises ? (
              <ActivityIndicator size="small" color="#D68D54" />
            ) : (
              selectedPlanExercises.map((exercise, index) => (
                <View key={exercise.exercise_id} style={styles.exerciseItem}>
                  <Text style={styles.exerciseName}>
                    {index + 1}. {exercise.name}
                  </Text>
                  {exercise.WorkoutPlanExercise && (
                    <Text style={styles.exerciseDetails}>
                      {exercise.WorkoutPlanExercise.sets && `${exercise.WorkoutPlanExercise.sets} sets`}
                      {exercise.WorkoutPlanExercise.sets && exercise.WorkoutPlanExercise.reps_targets && ` x `}
                      {exercise.WorkoutPlanExercise.reps_targets && `${exercise.WorkoutPlanExercise.reps_targets} reps`}
                      {((exercise.WorkoutPlanExercise.sets || exercise.WorkoutPlanExercise.reps_targets) && 
                        exercise.WorkoutPlanExercise.duration) && ` - `}
                      {exercise.WorkoutPlanExercise.duration && `${exercise.WorkoutPlanExercise.duration} sec`}
                    </Text>
                  )}
                  {exercise.description && (
                    <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                  )}
                </View>
              ))
            )}
          </ScrollView>
        </>
      )}
      
      <View style={styles.modalButtons}>
        <Button 
          style={styles.startButton} 
          mode="contained" 
          onPress={handleStartButton}
          labelStyle={styles.startButtonText}
        >
          Start Guide
        </Button>
      </View>
    </View>
  );

  return (
   <SafeAreaView style={{flex: 1}}>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Workout Guides</Text>
          <Text style={styles.headerSubtitle}>
            Find the perfect workout for your fitness journey
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D68D54" />
            <Text style={styles.loadingText}>Loading guides...</Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {guideList.map((guide) => (
              <TouchableOpacity 
                key={guide.plan_id} 
                onPress={() => handleGuideSelect(guide)}
                activeOpacity={0.8}
              >
                <PlaceCard 
                  title={guide.name}
                  subtext={guide.description || ""}
                  leftBottomText="20-30 min"
                  tag={guide.difficulty_level || "Beginner"} 
                  image={require('@/assets/images/yoga.png')}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <BottomSheet ref={bottomSheetRef}
                     onChange={handleSheetChanges}
                     index={-1} 
                     snapPoints={['10%', '50%', '90%']}
                     enablePanDownToClose={true}
                     enableContentPanningGesture={true}
                     handleIndicatorStyle={styles.bottomSheetIndicator}
        >
           <BottomSheetView style={styles.contentContainer}>
            {renderModal()}
           </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
   </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F4',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#9B8579',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingRight: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9B8579',
  },
  contentContainer: {
    padding: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 10,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(214, 141, 84, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  difficultyText: {
    color: '#D68D54',
    fontWeight: 'bold',
  },
  modalDescription: {
    fontSize: 16,
    color: '#3A2A1F',
    lineHeight: 24,
    marginBottom: 20,
  },
  modalStepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 12,
  },
  stepsContainer: {
    maxHeight: 200,
    marginBottom: 16,
  },
  exerciseItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(214, 141, 84, 0.2)',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#D68D54',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  modalButtons: {
    marginTop: 24,
    alignItems: 'center',
  },
  startButton: {
    width: '100%',
    padding: 6,
    backgroundColor: '#D68D54',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 4,
  },
  bottomSheetIndicator: {
    backgroundColor: '#D68D54',
    width: 40,
    height: 4,
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenTransition from '@/components/screenTransition';
import { ExerciseDBModal, WorkoutPlanDBModal } from '@/utils/dbFunctions';
import { Exercise } from '@/utils/table.types';

export default function CreateWorkout() {
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [reward, setReward] = useState('10');
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<{[key: number]: {sets: string, reps: string, duration: string}}>({});
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner', color: '#4CAF50', icon: 'leaf', coins: 10 },
    { value: 'intermediate', label: 'Intermediate', color: '#FF9800', icon: 'fitness', coins: 20 },
    { value: 'advanced', label: 'Advanced', color: '#F44336', icon: 'flame', coins: 30 }
  ];

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const exercises = await ExerciseDBModal.get();
      setAvailableExercises(exercises);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      Alert.alert('Error', 'Failed to load exercises');
    } finally {
      setLoading(false);
    }
  };

  const toggleExercise = (exerciseId: number) => {
    setSelectedExercises(prev => {
      if (prev[exerciseId]) {
        // Remove exercise
        const newState = { ...prev };
        delete newState[exerciseId];
        return newState;
      } else {
        // Add exercise with default values
        return {
          ...prev,
          [exerciseId]: { sets: '3', reps: '10', duration: '60' }
        };
      }
    });
  };

  const updateExerciseParams = (exerciseId: number, field: string, value: string) => {
    setSelectedExercises(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: value
      }
    }));
  };

  const createWorkout = async () => {
    if (!workoutName.trim()) {
      Alert.alert('Error', 'Please enter a workout name');
      return;
    }

    if (Object.keys(selectedExercises).length === 0) {
      Alert.alert('Error', 'Please select at least one exercise');
      return;
    }

    try {
      setCreating(true);
      
      // Prepare exercises data
      const exercisesData = Object.entries(selectedExercises).map(([exerciseId, params]) => ({
        exercise_id: parseInt(exerciseId),
        sets: parseInt(params.sets) || 3,
        reps_targets: parseInt(params.reps) || 10,
        duration: parseInt(params.duration) || 60
      }));

      const workoutData = {
        name: workoutName.trim(),
        description: workoutDescription.trim() || undefined,
        difficulty_level: difficulty,
        reward: parseInt(reward) || 10,
        exercises: exercisesData
      };

      await WorkoutPlanDBModal.insert(workoutData);
      
      Alert.alert(
        'Success', 
        'Workout created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              setWorkoutName('');
              setWorkoutDescription('');
              setDifficulty('beginner');
              setReward('10');
              setSelectedExercises({});
            }
          }
        ]
      );

    } catch (error) {
      console.error('Error creating workout:', error);
      Alert.alert('Error', 'Failed to create workout');
    } finally {
      setCreating(false);
    }
  };

  return (
    <ScreenTransition type='zoom'>
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Create Workout</Text>
              <Text style={styles.headerSubtitle}>Design your custom workout plan</Text>
            </View>

            {/* Workout Name */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Workout Name</Text>
              <TextInput
                value={workoutName}
                onChangeText={setWorkoutName}
                mode="outlined"
                style={styles.input}
                placeholder="e.g., Morning Strength Routine"
                outlineColor="#D68D54"
                activeOutlineColor="#D68D54"
                textColor="#000000"
              />
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description (Optional)</Text>
              <TextInput
                value={workoutDescription}
                onChangeText={setWorkoutDescription}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
                placeholder="Describe your workout..."
                outlineColor="#D68D54"
                activeOutlineColor="#D68D54"
                textColor="#000000"
              />
            </View>

            {/* Difficulty Level */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Difficulty Level</Text>
              <View style={styles.difficultyContainer}>
                {difficultyLevels.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.difficultyCard,
                      difficulty === level.value && { backgroundColor: level.color }
                    ]}
                    onPress={() => {
                      setDifficulty(level.value);
                      setReward(level.coins.toString());
                    }}
                  >
                    <Ionicons 
                      name={level.icon as any} 
                      size={24} 
                      color={difficulty === level.value ? '#FFFFFF' : level.color} 
                    />
                    <Text style={[
                      styles.difficultyText,
                      difficulty === level.value && { color: '#FFFFFF' }
                    ]}>
                      {level.label}
                    </Text>
                    <Text style={[
                      styles.coinText,
                      difficulty === level.value && { color: '#FFFFFF' }
                    ]}>
                      {level.coins} coins
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Reward */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reward</Text>
              <View style={styles.rewardDisplay}>
                <Ionicons name="cash" size={24} color="#D68D54" />
                <Text style={styles.rewardText}>{reward} coins</Text>
                <Text style={styles.rewardSubtext}>Automatically set by difficulty level</Text>
              </View>
            </View>

            {/* Exercise Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Exercises</Text>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading exercises...</Text>
                </View>
              ) : (
                <>
                  <Text style={styles.selectionInfo}>
                    {Object.keys(selectedExercises).length} exercise(s) selected
                  </Text>
                  
                  {/* Available Exercises */}
                  <Text style={styles.subsectionTitle}>Available Exercises</Text>
                  <View style={styles.exerciseGrid}>
                    {availableExercises.map((exercise) => (
                      <TouchableOpacity
                        key={exercise.exercise_id}
                        style={[
                          styles.exerciseCard,
                          selectedExercises[exercise.exercise_id] && styles.selectedExerciseCard
                        ]}
                        onPress={() => toggleExercise(exercise.exercise_id)}
                      >
                        <Ionicons 
                          name={selectedExercises[exercise.exercise_id] ? "checkmark-circle" : "add-circle-outline"}
                          size={20}
                          color={selectedExercises[exercise.exercise_id] ? "#FFFFFF" : "#D68D54"}
                        />
                        <Text style={[
                          styles.exerciseText,
                          selectedExercises[exercise.exercise_id] && styles.selectedExerciseText
                        ]}>
                          {exercise.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Selected Exercises Configuration */}
                  {Object.keys(selectedExercises).length > 0 && (
                    <>
                      <Text style={styles.subsectionTitle}>Configure Selected Exercises</Text>
                      {Object.entries(selectedExercises).map(([exerciseId, params]) => {
                        const exercise = availableExercises.find(ex => ex.exercise_id === parseInt(exerciseId));
                        return (
                          <View key={exerciseId} style={styles.exerciseConfigCard}>
                            <Text style={styles.exerciseConfigTitle}>{exercise?.name}</Text>
                            <View style={styles.exerciseConfigRow}>
                              <View style={styles.configField}>
                                <Text style={styles.configLabel}>Sets</Text>
                                <TextInput
                                  value={params.sets}
                                  onChangeText={(value) => updateExerciseParams(parseInt(exerciseId), 'sets', value)}
                                  mode="outlined"
                                  keyboardType="numeric"
                                  style={styles.configInput}
                                  outlineColor="#D68D54"
                                  activeOutlineColor="#D68D54"
                                  textColor="#000000"
                                />
                              </View>
                              <View style={styles.configField}>
                                <Text style={styles.configLabel}>Reps</Text>
                                <TextInput
                                  value={params.reps}
                                  onChangeText={(value) => updateExerciseParams(parseInt(exerciseId), 'reps', value)}
                                  mode="outlined"
                                  keyboardType="numeric"
                                  style={styles.configInput}
                                  outlineColor="#D68D54"
                                  activeOutlineColor="#D68D54"
                                  textColor="#000000"
                                />
                              </View>
                              <View style={styles.configField}>
                                <Text style={styles.configLabel}>Duration (sec)</Text>
                                <TextInput
                                  value={params.duration}
                                  onChangeText={(value) => updateExerciseParams(parseInt(exerciseId), 'duration', value)}
                                  mode="outlined"
                                  keyboardType="numeric"
                                  style={styles.configInput}
                                  outlineColor="#D68D54"
                                  activeOutlineColor="#D68D54"
                                  textColor="#000000"
                                />
                              </View>
                            </View>
                          </View>
                        );
                      })}
                    </>
                  )}
                </>
              )}
            </View>

            {/* Create Button */}
            <TouchableOpacity
              style={[
                styles.createButton,
                (creating || !workoutName.trim() || Object.keys(selectedExercises).length === 0) && styles.createButtonDisabled
              ]}
              onPress={createWorkout}
              disabled={creating || !workoutName.trim() || Object.keys(selectedExercises).length === 0}
            >
              <Ionicons name="add-circle" size={24} color="#FFFFFF" />
              <Text style={styles.createButtonText}>
                {creating ? 'Creating...' : 'Create Workout'}
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </SafeAreaView>
      </PaperProvider>
    </ScreenTransition>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F4',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A2A1F',
    marginTop: 8,
    textAlign: 'center',
  },
  coinText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9B8579',
    marginTop: 4,
    textAlign: 'center',
  },
  rewardDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  rewardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D68D54',
    marginLeft: 12,
  },
  rewardSubtext: {
    fontSize: 12,
    color: '#9B8579',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#9B8579',
  },
  selectionInfo: {
    fontSize: 14,
    color: '#9B8579',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A2A1F',
    marginTop: 16,
    marginBottom: 8,
  },
  exerciseConfigCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D68D54',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseConfigTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 12,
  },
  exerciseConfigRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  configField: {
    flex: 1,
    marginHorizontal: 4,
  },
  configLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3A2A1F',
    marginBottom: 4,
  },
  configInput: {
    backgroundColor: '#FFFFFF',
    height: 40,
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    margin: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedExerciseCard: {
    backgroundColor: '#D68D54',
    borderColor: '#D68D54',
  },
  exerciseText: {
    fontSize: 14,
    color: '#3A2A1F',
    marginLeft: 8,
    fontWeight: '500',
  },
  selectedExerciseText: {
    color: '#FFFFFF',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D68D54',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  createButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
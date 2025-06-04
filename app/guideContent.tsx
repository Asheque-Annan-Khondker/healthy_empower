import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, Animated, TouchableOpacity, ActivityIndicator, StatusBar, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { WorkoutPlanDBModal, WorkoutPlanExerciseDBModal, ExerciseDBModal } from '@/utils/dbFunctions';
import { WorkoutPlan, Exercise } from '@/utils/table.types';
import { WorkoutCompletionModal } from '@/components/WorkoutCompletionModal';
import { completeWorkoutPlan } from '@/utils/workoutService';

const { height, width } = Dimensions.get('window');


export default function GuideContent() {
    // Get safe area insets for proper positioning
    const insets = useSafeAreaInsets();
    
    // Get the workout ID from params
    const params = useLocalSearchParams();
    const workoutId = params.work_id ? Number(params.work_id) : 0;
    
    // Local state
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [completionModal, setCompletionModal] = useState<{
        visible: boolean;
        workoutName: string;
        rewardEarned: number;
        streakBonus: number;
        currentStreak: number;
        isNewRecord: boolean;
        newBalance: number;
    }>({
        visible: false,
        workoutName: '',
        rewardEarned: 0,
        streakBonus: 0,
        currentStreak: 0,
        isNewRecord: false,
        newBalance: 0
    });
    const flatListRef = useRef<FlatList>(null);
    const scrollY = useRef(new Animated.Value(0)).current;

    // Load workout plan and exercises
    useEffect(() => {
        const loadWorkoutPlan = async () => {
            if (workoutId) {
                setIsLoading(true);
                try {
                    console.log(`Fetching workout plan with ID: ${workoutId}`);
                    
                    // First, get the workout plan exercises (junction table)
                    const workoutPlanExercises = await WorkoutPlanExerciseDBModal.get({
                        plan_id: { eq: workoutId }
                    });
                    
                    console.log("Fetched workout plan exercises:", workoutPlanExercises);
                    
                    if (workoutPlanExercises && workoutPlanExercises.length > 0) {
                        // Extract exercise IDs and get exercise details in parallel
                        const exerciseIds = workoutPlanExercises.map(wpe => wpe.exercise_id);
                        console.log("Exercise IDs to fetch:", exerciseIds);
                        
                        // Fetch all exercise details using Promise.all with error handling
                        const exerciseDetailsPromises = exerciseIds.map(async (exerciseId, index) => {
                            try {
                                const result = await ExerciseDBModal.get({ exercise_id: { eq: exerciseId } });
                                return result.length > 0 ? result[0] : null;
                            } catch (error) {
                                console.error(`Failed to fetch exercise ${exerciseId}:`, error);
                                return null;
                            }
                        });
                        
                        const exerciseDetails = await Promise.all(exerciseDetailsPromises);
                        
                        // Combine exercise details with workout plan exercise metadata
                        const exercisesWithMetadata = exerciseDetails
                            .map((exercise, index) => {
                                if (!exercise) return null;
                                
                                const workoutPlanExercise = workoutPlanExercises[index];
                                
                                return {
                                    ...exercise,
                                    WorkoutPlanExercise: workoutPlanExercise // Attach metadata like sets, reps, duration
                                };
                            })
                            .filter((exercise): exercise is Exercise & { WorkoutPlanExercise: any } => 
                                exercise !== null && exercise.exercise_id !== undefined
                            ); // Filter out null results with type guard
                        
                        setExercises(exercisesWithMetadata);
                        console.log("Exercises loaded with metadata:", exercisesWithMetadata.length);
                        
                        if (exercisesWithMetadata.length > 0) {
                            console.log("Sample exercise with metadata:", exercisesWithMetadata[0]);
                            // Set workout plan (you might want to fetch this separately if needed)
                            setWorkoutPlan({ plan_id: workoutId } as WorkoutPlan);
                        } else {
                            console.warn("No valid exercises found after fetching details");
                        }
                        
                    } else {
                        console.warn("No exercises found in workout plan with ID:", workoutId);
                        setExercises([]);
                    }
                } catch (error) {
                    console.error("Error loading workout plan:", error);
                    setExercises([]);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        
        loadWorkoutPlan();
    }, [workoutId]);

    // Function to handle dot press for scrolling to specific page
    const handleDotPress = (index: number) => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
        // Let onMomentumScrollEnd handle the page state update to avoid race conditions
    };

    // Handle workout completion
    const handleWorkoutCompletion = async () => {
        if (!workoutId) {
            Alert.alert('Error', 'No workout ID found');
            return;
        }

        try {
            // Create exercise completion data from the exercises array
            const exercisesCompleted = exercises.map(exercise => ({
                exercise_id: exercise.exercise_id,
                sets_completed: exercise.WorkoutPlanExercise?.sets || null,
                reps_completed: exercise.WorkoutPlanExercise?.reps_targets || null,
                duration: exercise.WorkoutPlanExercise?.duration || null,
                notes: `Completed as part of workout`
            }));

            const result = await completeWorkoutPlan(workoutId, exercisesCompleted);
            
            // Show completion modal
            setCompletionModal({
                visible: true,
                workoutName: result.workout_plan,
                rewardEarned: result.reward_earned,
                streakBonus: result.streak_bonus,
                currentStreak: result.current_streak,
                isNewRecord: result.is_new_record,
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

    // Close completion modal and navigate back
    const closeCompletionModal = () => {
        setCompletionModal({
            visible: false,
            workoutName: '',
            rewardEarned: 0,
            streakBonus: 0,
            currentStreak: 0,
            isNewRecord: false,
            newBalance: 0
        });
        router.push('/(drawer)/(guide)/guideSelection');
    };

    // Render indicator dots
    const renderIndicator = () => (
        <View style={styles.indicatorContainer}>
            {exercises.map((_, index) => (
                <TouchableOpacity key={index} onPress={() => handleDotPress(index)}>
                    <View
                        style={[
                            styles.indicatorDot,
                            index === currentPage && styles.activeDot
                        ]}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );

    // Get the first letter of exercise name for the circle icon
    const getExerciseInitial = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : 'E';
    };
    
    // Format rest time to convert seconds to minutes when greater than 60
    const formatRestTime = (seconds: number): string => {
        if (seconds > 60) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            
            if (remainingSeconds === 0) {
                return `${minutes}m`;
            } else {
                return `${minutes}m ${remainingSeconds}s`;
            }
        }
        return `${seconds}s`;
    };

    // Loading state
    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#D68D54" />
                    <Text style={styles.loadingText}>Loading workout...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Empty state
    if (!isLoading && exercises.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backIcon} 
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#D68D54" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Workout Guide</Text>
                </View>
                
                <View style={styles.emptyContainer}>
                    <Ionicons name="fitness-outline" size={60} color="#D68D5480" />
                    <Text style={styles.emptyText}>No exercises found for this workout.</Text>
                    <Text style={styles.emptySubtext}>This workout plan doesn't have any exercises yet.</Text>
                    <Button 
                        mode="contained" 
                        onPress={() => router.back()}
                        style={styles.backToGuidesButton}
                    >
                        Back to Guides
                    </Button>
                </View>
            </SafeAreaView>
        );
    }

    // Main content
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Exercise Guide</Text>
                <Text style={styles.pageCount}>{currentPage + 1} of {exercises.length}</Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={exercises}
                keyExtractor={(item) => item.exercise_id.toString()}
                renderItem={({ item, index }) => {
                    // Check if exercise has minimum required data (just name, type, and workout plan exercise data)
                    const hasRequiredData = item.name && 
                        item.type &&
                        item.WorkoutPlanExercise &&
                        (item.WorkoutPlanExercise.sets || item.WorkoutPlanExercise.reps_targets || item.WorkoutPlanExercise.duration);

                    // If data is incomplete, show error card
                    if (!hasRequiredData) {
                        return (
                            <View style={styles.exerciseCard}>
                                <View style={styles.errorCardContent}>
                                    <Ionicons name="warning-outline" size={60} color="#FF6B6B" />
                                    <Text style={styles.errorTitle}>Couldn't Load Exercise</Text>
                                    <Text style={styles.errorMessage}>
                                        This exercise is missing required data. Please check your workout plan.
                                    </Text>
                                    <Button 
                                        mode="outlined" 
                                        onPress={() => router.back()}
                                        style={styles.errorButton}
                                    >
                                        Back to Guides
                                    </Button>
                                </View>
                            </View>
                        );
                    }

                    const sets = item.WorkoutPlanExercise.sets || 0;
                    const reps = item.WorkoutPlanExercise.reps_targets || 0;
                    const rest = item.WorkoutPlanExercise.duration || 60; // Default 60 seconds
                    const difficulty = item.difficulty_level || 'Unknown';
                    const type = item.type || 'Exercise';
                    const target = item.target_muscle_group || 'General';
                    
                    return (
                        <View style={styles.exerciseCard}>
                            <View style={styles.exerciseTypeContainer}>
                                <Text style={styles.exerciseType}>{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</Text>
                                <View style={[styles.difficultyTag, 
                                    difficulty.toLowerCase() === 'beginner' ? styles.beginnerTag : 
                                    difficulty.toLowerCase() === 'intermediate' ? styles.intermediateTag : 
                                    styles.advancedTag]}>
                                    <Text style={styles.difficultyText}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()}</Text>
                                </View>
                            </View>
                            
                            <View style={styles.exerciseContent}>
                                <View style={styles.exerciseIconSection}>
                                    <Animated.View style={styles.exerciseIconContainer}>
                                        <Text style={styles.exerciseIconText}>{getExerciseInitial(item.name)}</Text>
                                    </Animated.View>
                                </View>
                                
                                <View style={styles.exerciseDetails}>
                                    <Text style={styles.exerciseName}>{item.name}</Text>
                                    
                                    <View style={styles.targetContainer}>
                                        <Text style={styles.targetText}>Target: {target}</Text>
                                    </View>
                                    
                                    <Text style={styles.exerciseDescription}>
                                        {item.description || 'Follow the exercise form and technique as demonstrated. Focus on proper posture and controlled movements.'}
                                    </Text>
                                </View>
                                
                                <View style={styles.exerciseMetrics}>
                                    <View style={styles.metricItem}>
                                        <Text style={styles.metricValue}>{sets}</Text>
                                        <Text style={styles.metricLabel}>Sets</Text>
                                    </View>
                                    <View style={styles.metricDivider} />
                                    <View style={styles.metricItem}>
                                        <Text style={styles.metricValue}>{reps}</Text>
                                        <Text style={styles.metricLabel}>Reps</Text>
                                    </View>
                                    <View style={styles.metricDivider} />
                                    <View style={styles.metricItem}>
                                        <Text style={styles.metricValue}>{formatRestTime(rest)}</Text>
                                        <Text style={styles.metricLabel}>Rest</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    );
                }}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                onMomentumScrollEnd={event => {
                    const offsetY = event.nativeEvent.contentOffset.y;
                    const page = Math.round(offsetY / height);
                    setCurrentPage(page);
                    
                    // Add haptic feedback for page changes (if available)
                    try {
                        const HapticFeedback = require('expo-haptics');
                        HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Light);
                    } catch (error) {
                        // Haptics not available on this platform
                    }
                }}
                getItemLayout={(_, index) => ({
                    length: height,
                    offset: height * index,
                    index,
                })}
                decelerationRate="fast"
                snapToInterval={height}
                snapToAlignment="start"
            />
            
            {renderIndicator()}
            
            {/* Floating overlay button with safe area consideration - only show on last exercise */}
            {currentPage === exercises.length - 1 && (
                <View style={[styles.overlayButtonContainer, { bottom: Math.max(insets.bottom + 20, 30) }]}>
                    <Button
                        mode="contained"
                        onPress={handleWorkoutCompletion}
                        style={styles.overlayButton}
                        contentStyle={styles.overlayButtonContent}
                        labelStyle={styles.overlayButtonText}
                        icon="check-circle"
                    >
                        Finish
                    </Button>
                </View>
            )}
            
            <WorkoutCompletionModal
                visible={completionModal.visible}
                onClose={closeCompletionModal}
                workoutName={completionModal.workoutName}
                rewardEarned={completionModal.rewardEarned}
                streakBonus={completionModal.streakBonus}
                currentStreak={completionModal.currentStreak}
                isNewRecord={completionModal.isNewRecord}
                newBalance={completionModal.newBalance}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    pageCount: {
        fontSize: 14,
        color: '#666666',
    },
    backIcon: {
        padding: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: '#3A2A1F',
        marginTop: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3A2A1F',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 16,
        color: '#9B8579',
        marginBottom: 24,
        textAlign: 'center',
    },
    backToGuidesButton: {
        backgroundColor: '#D68D54',
        marginTop: 20,
    },
    exerciseCard: {
        width: width,
        height: height, // Full height to match getItemLayout
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingBottom: 100, // Extra bottom padding to account for overlay button
    },
    exerciseTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    exerciseType: {
        fontSize: 16,
        color: '#666666',
        fontWeight: '400',
    },
    difficultyTag: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    beginnerTag: {
        backgroundColor: '#4CAF50',
    },
    intermediateTag: {
        backgroundColor: '#FF9800',
    },
    advancedTag: {
        backgroundColor: '#F44336',
    },
    difficultyText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
    exerciseContent: {
        backgroundColor: '#FFF5EE',
        borderRadius: 15,
        flex: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    exerciseIconSection: {
        alignItems: 'center',
        paddingTop: 30,
    },
    exerciseIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FAE6D6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: "#D68D54",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    exerciseDetails: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        flex: 1,
    },
    exerciseIconText: {
        fontSize: 50,
        color: '#D68D54',
        fontWeight: '300',
    },
    exerciseName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 8,
        textAlign: 'center',
    },
    targetContainer: {
        marginBottom: 15,
        alignItems: 'center',
    },
    targetText: {
        fontSize: 14,
        color: '#666666',
        fontStyle: 'italic',
    },
    exerciseDescription: {
        fontSize: 15,
        color: '#555555',
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 20,
    },
    exerciseMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        marginTop: 'auto',
    },
    metricItem: {
        alignItems: 'center',
        flex: 1,
    },
    metricValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#D68D54',
    },
    metricLabel: {
        fontSize: 12,
        color: '#666666',
        marginTop: 5,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    metricDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#E0E0E0',
    },
    // Error card styles
    errorCardContent: {
        flex: 1,
        backgroundColor: '#FFF5F5',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        borderWidth: 2,
        borderColor: '#FFE5E5',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF6B6B',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    errorMessage: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    errorButton: {
        borderColor: '#FF6B6B',
    },
    indicatorContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 15,
        top: '50%',
        transform: [{ translateY: -40 }],
        zIndex: 10,
    },
    indicatorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(214, 141, 84, 0.3)',
        marginVertical: 4,
    },
    activeDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#D68D54',
        marginVertical: 4,
    },
    // Floating overlay button styles
    overlayButtonContainer: {
        position: 'absolute',
        left: 20,
        right: 20,
        // bottom will be set dynamically with safe area insets
        zIndex: 1000,
    },
    overlayButton: {
        backgroundColor: '#D68D54',
        borderRadius: 30,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        width: '100%', // Full width of container
    },
    overlayButtonContent: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        flexDirection: 'row-reverse', // Icon on the right
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        marginLeft: 8, // Changed from marginRight since icon is on the right
    },
});
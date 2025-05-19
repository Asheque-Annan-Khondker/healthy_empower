import React, { createContext, useState, useContext, ReactNode } from 'react';

// Exercise interface (matches your backend model)
export interface Exercise {
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

// WorkoutPlan interface (matches your backend model)
export interface WorkoutPlan {
  plan_id: number;
  name: string;
  description: string;
  difficulty_level: string;
  created_at: string;
  Exercises?: Exercise[];
}

// Define context type
interface WorkoutContextType {
  selectedWorkoutPlan: WorkoutPlan | null;
  setSelectedWorkoutPlan: (plan: WorkoutPlan | null) => void;
  selectedExercises: Exercise[];
  setSelectedExercises: (exercises: Exercise[]) => void;
}

// Create context with default values
const WorkoutContext = createContext<WorkoutContextType>({
  selectedWorkoutPlan: null,
  setSelectedWorkoutPlan: () => {},
  selectedExercises: [],
  setSelectedExercises: () => {},
});

// Provider component
export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedWorkoutPlan, setSelectedWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  return (
    <WorkoutContext.Provider
      value={{
        selectedWorkoutPlan,
        setSelectedWorkoutPlan,
        selectedExercises,
        setSelectedExercises,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

// Custom hook to use the context
export const useWorkout = () => useContext(WorkoutContext);
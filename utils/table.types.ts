

export {Goal, Exercise, Food, FoodMacros, Guide, Achievement, ACHIEVEMENT_CATEGORIES,MealLog, WorkoutPlan, AchievementCategories, WorkoutPlanExercise}

// The server database has different properties
interface Exercise {
  exercise_id: number;
  name: string;
  description: string;
  type: string;
  measurementType: string;
  difficulty_level: string;
  target_muscle_group: string;
}

interface Guide {
  id: number;
  title: string;
  difficulty: string;
  category: string;
  steps: string[];
}
type AchievementCategories = 'nutrition'|'fitness'|'consistency'|'milestone'

interface Achievement{
    id: number
    title: string
    description: string
    icon: string
    category: AchievementCategories
    completed: boolean | number
    progress: number
    target_progress: number
    completion_date: string | null
    xp: number
}
interface WorkoutPlan{
  plan_id: number
  name: string
  description: string
  difficulty_level: String
  created_at: string
}
interface Food {
    food_id: number
    name: string
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
    serving_size: string
    serving_unit_id: number
    created_at: string
    meal_type: string
}

interface FoodMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
interface WorkoutPlanExercise {
  plan_id: number;
  exercise_id: number;
  sets: number;
  reps_targets: number;
  duration: number;
}
interface MealLog{
  meal_id: number
  user_id: number
  food_id: number
  meal_type: string
  servings: number
  logged_at: string
}

interface Goal{
    goal_id: string,
    user_id:string,
    type: string,
    target_value: number,
    start_date: string,
    description: string,

}


const ACHIEVEMENT_CATEGORIES = {
    NUTRITION:  'nutrition',
    FITNESS: 'fitness',
    CONSISTENCY: 'consistency',
    MILESTONE: 'milestone' 
}


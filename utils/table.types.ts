

export {Exercise, Food, Guide, Achievement, ACHIEVEMENT_CATEGORIES, AchievementCategories}

interface Exercise {
  id: number;
  name: string;
  description: string;
  duration: number; // in minutes
  caloriesBurned: number; // per minute
  sets?: number,
  reps?: number
  notes?: string
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

interface Food {
    id: number
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
    date: string
    meal_type: string
}

const ACHIEVEMENT_CATEGORIES = {
    NUTRITION:  'nutrition',
    FITNESS: 'fitness',
    CONSISTENCY: 'consistency',
    MILESTONE: 'milestone' 
}

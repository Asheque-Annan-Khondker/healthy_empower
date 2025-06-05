// Service to calculate nutrition data from meal logs
import { MealLogDBModal, FoodDBModal } from './dbFunctions';
import { MealLog, Food } from './table.types';

export interface MacroData {
  current: number;
  target: number;
}

export interface NutritionSummary {
  protein: MacroData;
  carbs: MacroData;
  fats: MacroData;
  totalCalories: number;
  targetCalories: number;
}

export interface WeeklyNutritionData {
  score: number;
  balancedDays: number;
  totalDays: number;
  trend: 'up' | 'down' | 'stable';
}

export class NutritionDataService {
  
  // Default daily targets
  private static readonly DEFAULT_TARGETS = {
    calories: 2000,
    protein: 150, // grams
    carbs: 250,   // grams
    fats: 75      // grams
  };

  static async getTodaysMacros(): Promise<NutritionSummary> {
    try {
      // Get today's date range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get today's meal logs
      const todaysMealLogs = await MealLogDBModal.get({
        logged_at: {
          gte: today.toISOString(),
          lt: tomorrow.toISOString()
        }
      });

      if (!todaysMealLogs || todaysMealLogs.length === 0) {
        return {
          protein: { current: 0, target: this.DEFAULT_TARGETS.protein },
          carbs: { current: 0, target: this.DEFAULT_TARGETS.carbs },
          fats: { current: 0, target: this.DEFAULT_TARGETS.fats },
          totalCalories: 0,
          targetCalories: this.DEFAULT_TARGETS.calories
        };
      }

      // Get unique food IDs and fetch food data
      const uniqueFoodIds = [...new Set(todaysMealLogs.map(log => log.food_id))];
      const foodsData = await Promise.all(
        uniqueFoodIds.map(foodId => 
          FoodDBModal.get({ food_id: { eq: foodId } })
        )
      ).then(results => results.flat());

      // Calculate totals
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFats = 0;
      let totalCalories = 0;

      todaysMealLogs.forEach(mealLog => {
        const food = foodsData.find(f => f.food_id === mealLog.food_id);
        if (food) {
          const servings = mealLog.servings || 1;
          totalProtein += (food.protein || 0) * servings;
          totalCarbs += (food.carbs || 0) * servings;
          totalFats += (food.fat || 0) * servings;
          totalCalories += (food.calories || 0) * servings;
        }
      });

      return {
        protein: { 
          current: Math.round(totalProtein * 10) / 10, 
          target: this.DEFAULT_TARGETS.protein 
        },
        carbs: { 
          current: Math.round(totalCarbs * 10) / 10, 
          target: this.DEFAULT_TARGETS.carbs 
        },
        fats: { 
          current: Math.round(totalFats * 10) / 10, 
          target: this.DEFAULT_TARGETS.fats 
        },
        totalCalories: Math.round(totalCalories),
        targetCalories: this.DEFAULT_TARGETS.calories
      };

    } catch (error) {
      console.error('Error calculating today\'s macros:', error);
      return {
        protein: { current: 0, target: this.DEFAULT_TARGETS.protein },
        carbs: { current: 0, target: this.DEFAULT_TARGETS.carbs },
        fats: { current: 0, target: this.DEFAULT_TARGETS.fats },
        totalCalories: 0,
        targetCalories: this.DEFAULT_TARGETS.calories
      };
    }
  }

  static async getWeeklyNutritionScore(): Promise<WeeklyNutritionData> {
    try {
      // Get data for the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const weeklyMealLogs = await MealLogDBModal.get({
        logged_at: { gte: sevenDaysAgo.toISOString() }
      });

      if (!weeklyMealLogs || weeklyMealLogs.length === 0) {
        return {
          score: 0,
          balancedDays: 0,
          totalDays: 7,
          trend: 'stable'
        };
      }

      // Group by day and calculate daily scores
      const dayScores: { [date: string]: number } = {};
      const mealsByDay: { [date: string]: MealLog[] } = {};

      weeklyMealLogs.forEach(meal => {
        const dateKey = new Date(meal.logged_at).toISOString().split('T')[0];
        if (!mealsByDay[dateKey]) {
          mealsByDay[dateKey] = [];
        }
        mealsByDay[dateKey].push(meal);
      });

      // Get food data for score calculation
      const uniqueFoodIds = [...new Set(weeklyMealLogs.map(log => log.food_id))];
      const foodsData = await Promise.all(
        uniqueFoodIds.map(foodId => 
          FoodDBModal.get({ food_id: { eq: foodId } })
        )
      ).then(results => results.flat());

      let balancedDays = 0;
      
      // Calculate score for each day
      Object.entries(mealsByDay).forEach(([date, meals]) => {
        const dailyScore = this.calculateDailyNutritionScore(meals, foodsData);
        dayScores[date] = dailyScore;
        if (dailyScore >= 70) { // Consider 70+ as "balanced"
          balancedDays++;
        }
      });      // Calculate average weekly score
      const scores = Object.values(dayScores);
      let averageScore = scores.length > 0 
        ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
        : 0;

      // Ensure score is within valid range (0-100)
      averageScore = Math.max(0, Math.min(100, averageScore));

      // Debug logging
      console.log('📊 Weekly Nutrition Score Calculation:');
      console.log('   Daily scores:', dayScores);
      console.log('   Average score:', averageScore);
      console.log('   Balanced days:', balancedDays);
      console.log('   Total days:', 7);

      // Determine trend (simplified - compare first half vs second half of week)
      const firstHalf = scores.slice(0, Math.ceil(scores.length / 2));
      const secondHalf = scores.slice(Math.ceil(scores.length / 2));
      
      const firstHalfAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
      
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (secondHalfAvg > firstHalfAvg + 5) trend = 'up';
      else if (secondHalfAvg < firstHalfAvg - 5) trend = 'down';

      return {
        score: averageScore,
        balancedDays,
        totalDays: 7,
        trend
      };

    } catch (error) {
      console.error('Error calculating weekly nutrition score:', error);
      return {
        score: 0,
        balancedDays: 0,
        totalDays: 7,
        trend: 'stable'
      };
    }
  }

  private static calculateDailyNutritionScore(meals: MealLog[], foodsData: Food[]): number {
    // Calculate daily nutrition totals
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let totalCalories = 0;

    meals.forEach(meal => {
      const food = foodsData.find(f => f.food_id === meal.food_id);
      if (food) {
        const servings = meal.servings || 1;
        totalProtein += (food.protein || 0) * servings;
        totalCarbs += (food.carbs || 0) * servings;
        totalFats += (food.fat || 0) * servings;
        totalCalories += (food.calories || 0) * servings;
      }
    });

    // Score based on how close to targets (simplified scoring)
    const proteinScore = Math.min(100, (totalProtein / this.DEFAULT_TARGETS.protein) * 100);
    const carbsScore = Math.min(100, (totalCarbs / this.DEFAULT_TARGETS.carbs) * 100);
    const fatsScore = Math.min(100, (totalFats / this.DEFAULT_TARGETS.fats) * 100);
    const calorieScore = Math.min(100, (totalCalories / this.DEFAULT_TARGETS.calories) * 100);

    // Balanced score - penalize being too far from targets
    const balancedScore = (proteinScore + carbsScore + fatsScore + calorieScore) / 4;
    
    // Additional points for variety (number of different meal types)
    const mealTypes = new Set(meals.map(m => m.meal_type));
    const varietyBonus = Math.min(20, mealTypes.size * 5);

    return Math.min(100, Math.round(balancedScore + varietyBonus));
  }
}

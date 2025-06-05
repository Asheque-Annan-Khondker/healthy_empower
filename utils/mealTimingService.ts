import { MealLogDBModal } from './dbFunctions';
import { MealLog } from './table.types';

export interface MealTimingData {
  mostActiveEatingTime: string;
  longestGapBetweenMeals: number;
  averageMealsPerDay: number;
  lastMealTime: string;
}

export class MealTimingService {
  
  static async calculateMealTimingInsights(): Promise<MealTimingData> {
    try {
      // Get meal logs from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoISO = sevenDaysAgo.toISOString();      const mealLogs = await MealLogDBModal.get({
        logged_at: { gte: sevenDaysAgoISO }
      });      console.log(`MealTimingService: Found ${mealLogs?.length || 0} meal logs in last 7 days`);
      console.log('Sample meal data:', mealLogs?.slice(0, 3).map(meal => ({
        logged_at: meal.logged_at,
        meal_type: meal.meal_type,
        food_id: meal.food_id
      })));

      if (!mealLogs || mealLogs.length === 0) {
        return {
          mostActiveEatingTime: 'No data',
          longestGapBetweenMeals: 0,
          averageMealsPerDay: 0,
          lastMealTime: 'No meals logged',
        };
      }

      // Sort meals by logged_at timestamp
      const sortedMeals = mealLogs.sort((a, b) => 
        new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime()
      );

      return {
        mostActiveEatingTime: this.calculateMostActiveEatingTime(sortedMeals),
        longestGapBetweenMeals: this.calculateLongestGap(sortedMeals),
        averageMealsPerDay: this.calculateAverageMealsPerDay(sortedMeals),
        lastMealTime: this.getLastMealTime(sortedMeals),
      };

    } catch (error) {
      console.error('Error calculating meal timing insights:', error);
      return {
        mostActiveEatingTime: 'Error',
        longestGapBetweenMeals: 0,
        averageMealsPerDay: 0,
        lastMealTime: 'Error loading data',
      };
    }
  }
  private static calculateMostActiveEatingTime(meals: MealLog[]): string {
    console.log('🕐 DEBUG: calculateMostActiveEatingTime called with', meals.length, 'meals');
    
    if (meals.length === 0) {
      console.log('🕐 DEBUG: No meals, returning "No data"');
      return 'No data';
    }
    
    const hourCounts: { [hour: number]: number } = {};
      // Count meals by hour with debug logging - USE UTC HOURS to avoid timezone conversion
    meals.forEach((meal, index) => {
      const originalTime = meal.logged_at;
      const date = new Date(originalTime);
      // Use getUTCHours() instead of getHours() to avoid local timezone conversion
      const hour = date.getUTCHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      
      if (index < 5) { // Log first 5 meals for debugging
        console.log(`🕐 DEBUG: Meal ${index + 1}: ${originalTime} -> UTC Hour ${hour} (Local: ${date.toLocaleString()})`);
      }
    });

    console.log('🕐 DEBUG: Hour counts:', hourCounts);

    // Find the hour with most meals
    let mostActiveHour = 0;
    let maxCount = 0;
    for (const [hour, count] of Object.entries(hourCounts)) {
      console.log(`🕐 DEBUG: Hour ${hour} has ${count} meals`);
      if (count > maxCount) {
        maxCount = count;
        mostActiveHour = parseInt(hour);
        console.log(`🕐 DEBUG: New most active hour: ${mostActiveHour} with ${maxCount} meals`);
      }
    }
      console.log(`🕐 DEBUG: Final most active UTC hour: ${mostActiveHour}`);

    // Format time nicely - Note: displaying UTC time since that's how meals are stored
    let formattedTime = '';
    if (mostActiveHour === 0) {
      formattedTime = '12:00 AM';
    } else if (mostActiveHour < 12) {
      formattedTime = `${mostActiveHour}:00 AM`;
    } else if (mostActiveHour === 12) {
      formattedTime = '12:00 PM';
    } else {
      formattedTime = `${mostActiveHour - 12}:00 PM`;
    }
    
    console.log(`🕐 DEBUG: Formatted time: ${formattedTime}`);
    return formattedTime;
  }

  private static calculateLongestGap(meals: MealLog[]): number {
    if (meals.length < 2) return 0;

    let longestGap = 0;
    
    for (let i = 1; i < meals.length; i++) {
      const prevMealTime = new Date(meals[i - 1].logged_at).getTime();
      const currentMealTime = new Date(meals[i].logged_at).getTime();
      const gapHours = (currentMealTime - prevMealTime) / (1000 * 60 * 60);
      
      if (gapHours > longestGap) {
        longestGap = gapHours;
      }
    }

    return longestGap;
  }
  private static calculateAverageMealsPerDay(meals: MealLog[]): number {
    if (meals.length === 0) return 0;

    // Group meals by date
    const mealsByDate: { [date: string]: number } = {};
    
    meals.forEach(meal => {
      const date = new Date(meal.logged_at).toISOString().split('T')[0];
      mealsByDate[date] = (mealsByDate[date] || 0) + 1;
    });    const totalDays = Object.keys(mealsByDate).length;
    const totalMeals = meals.length;
    
    console.log('Meals by date:', mealsByDate);
    console.log(`Total meals: ${totalMeals}, Total days: ${totalDays}`);

    // Round to 1 decimal place for clean display
    return Math.round((totalMeals / totalDays) * 10) / 10;
  }

  private static getLastMealTime(meals: MealLog[]): string {
    if (meals.length === 0) return 'No meals logged';

    const lastMeal = meals[meals.length - 1];
    const lastMealDate = new Date(lastMeal.logged_at);
    const now = new Date();
    
    const timeDiff = now.getTime() - lastMealDate.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (hoursDiff < 1) {
      const minutesDiff = Math.round(timeDiff / (1000 * 60));
      return `${minutesDiff} minutes ago`;
    } else if (hoursDiff < 24) {
      return `${Math.round(hoursDiff)} hours ago`;
    } else {
      const daysDiff = Math.round(hoursDiff / 24);
      return `${daysDiff} days ago`;
    }
  }
}

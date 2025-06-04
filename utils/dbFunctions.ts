import {Achievement, Exercise, Food, Goal, Guide, MealLog, WorkoutPlan, WorkoutPlanExercise} from "./table.types";
import axios from "axios";
import { API_URL } from "@/constants/DBAPI";
import { getUserId } from "./authState";
// make a filter function
// Done

// Filter function e.g. get({paramname: value})
// Update to filters. 
// Format:
// {column_name: {
//      filter: value,
//      filter: value,
//      ...
//      }}
// This is so  the unlrelated properties don't get recommended
type AllowedOp =
  | 'eq' | 'ne' | 'gte' | 'gt' | 'lte' | 'lt'
  | 'not' | 'in' | 'notIn' | 'like' | 'notLike'
  | 'iLike' | 'notILike' | 'regexp' | 'notRegexp'
  | 'iRegexp' | 'notIRegexp' | 'between' | 'notBetween'
  | 'overlap' | 'contains' | 'contained' | 'adjacent'
  | 'strictLeft' | 'strictRight' | 'noExtendRight' | 'noExtendLeft'
  | 'and' | 'or' | 'any' | 'all' | 'values' | 'col';

type Filter<T> = {
  [K in keyof T]?: {
    [O in AllowedOp]?: any
  } | T[K]
}
//* not implemented yet
async function dropall(): Promise<void>{
  try {
  const apiUrl = await API_URL();
  await axios.delete(`${apiUrl}/api/foods`)
  } catch(err){console.error('Can\'t drop | wont drop', err)}
}
class AchievementDBModal {
  static async get(filter?: Filter<Achievement>): Promise<Achievement[]> {
    let params = filter && Object.keys(filter).length > 0
                  ? '?filters=' + encodeURIComponent(JSON.stringify(filter))
                  : '';
const apiUrl = await API_URL();
const userId = await getUserId();
if (!userId) {
  console.error('❌ AchievementDBModal: No user ID available');
  return [];
}
const rawResult = await axios.get(`${apiUrl}/api/users/${userId}/achievements${params}`).then(res=>res.data.data);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult : []


  }
  static async update(payload: Partial<Achievement>): Promise<void>{
    // Only the completed and progress properties may be updated. the progress may only rise too 100

    const submit = {
      progress: payload.progress
    }
    const userId = await getUserId();
    if (!userId) {
      console.error('❌ AchievementDBModal: No user ID available for update');
      return;
    }
    const apiUrl = await API_URL();
    const url = `${apiUrl}/api/users/${userId}/achievements/${payload.id}`;
   await axios.put(url, submit)


    
  }
}

class ExerciseDBModal {
  static async get(filter?: Filter<Exercise>): Promise<Exercise[]> {

    let params = filter && Object.keys(filter).length > 0
                  ? '?filters=' + encodeURIComponent(JSON.stringify(filter))
                  : '';
    const apiUrl = await API_URL();
    const rawResult = await axios.get(`${apiUrl}/api/exercises${params}`).then(res=>res.data.data);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult : []
  }

  static async getById(id: number): Promise<Exercise | null> {
    //TODO: Learn how to request from  property
const apiUrl = await API_URL();
const rawResult = await axios.get(`${apiUrl}/api/exercises?exercise_id=${id}`);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult[0] : null;  }
}

class GuideDBModal {
  static async get(filter?: Filter<Guide>): Promise<Guide[]> {
    let params = filter && Object.keys(filter).length > 0
                  ? '?filters=' + encodeURIComponent(JSON.stringify(filter))
                  : '';
    const apiUrl = await API_URL();
    const rawResult = await axios.get(`${apiUrl}/api/workout-plans${params}`).then(res => res.data.data);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult : []
  }

}

class FoodDBModal {
  static async get(filter?: Filter<Food>): Promise<Food[]> {
    
    let params = filter && Object.keys(filter).length > 0
                  ? '?filters=' + encodeURIComponent(JSON.stringify(filter))
                  : '';
    // Iterate over the filter object and append to params string
    
    const apiUrl = await API_URL();
    const url = `${apiUrl}/api/foods${params}`
    const res = await axios.get(url).then(res => res.data.data);
    return Array.isArray(res) && res.length > 0 ? res : []
  }
  static async createEntry(payload: Partial<Food>): Promise<void> {
    const apiUrl = await API_URL();
    const url = `${apiUrl}/api/foods`;
    await axios.post(url, payload)
  }
  static async insert(content: Partial<Food>): Promise<Food>{
      const submit = {
        name: content.name,
        calories: content.calories,
        protein: content.protein,
        carbs: content.carbs,
        fat: content.fat,
        serving_size: content.serving_size,
        serving_unit_id: content.serving_unit_id
      }
      try {
        const apiUrl = await API_URL();
        const response = await axios.post(`${apiUrl}/api/foods`, submit);
        console.log('✅ FoodDBModal: Food inserted successfully:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('❌ FoodDBModal: Error inserting food:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to create food entry');
      }
  }
  

}
class MealLogDBModal {
  static async get(filter?: Filter<MealLog>): Promise<MealLog[]> {
    let params = filter && Object.keys(filter).length > 0
                  ? '?filters=' + encodeURIComponent(JSON.stringify(filter))
                  : '';
    // Iterate over the filter object and append to params string
    const userId = await getUserId();
    console.log("User id for meal log: ", userId);
    if (!userId) {
      console.error('❌ MealLogDBModal: No user ID available');
      return [];
    }
    const apiUrl = await API_URL();
    const rawResult = await axios.get(`${apiUrl}/api/users/${userId}/meal-logs${params}`).then(res => res.data.data);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult : []
  }
  static async create(content: Partial<MealLog>): Promise<void> {
    const userId = await getUserId();
    if (!userId) {
      console.error('❌ MealLogDBModal: No user ID available for create');
      throw new Error('User not authenticated');
    }
    try {
      const apiUrl = await API_URL();
      const response = await axios.post(`${apiUrl}/api/users/${userId}/meal-logs`, content);
      console.log('✅ MealLogDBModal: Meal log created successfully:', response.data);
    } catch (error: any) {
      console.error('❌ MealLogDBModal: Error creating meal log:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to log meal');
    }
  }
  
  static async delete(mealId: number): Promise<void> {
    const userId = await getUserId();
    if (!userId) {
      console.error('❌ MealLogDBModal: No user ID available for delete');
      throw new Error('User not authenticated');
    }
    const apiUrl = await API_URL();
    await axios.delete(`${apiUrl}/api/users/${userId}/meal-logs/${mealId}`)
      .then(res => console.log('✅ MealLogDBModal: Meal log deleted successfully:', res.data))
      .catch(err => {
        console.error('❌ MealLogDBModal: Error deleting meal log:', err.response?.data || err.message);
        throw new Error(err.response?.data?.error || 'Failed to delete meal log');
      });
  }
}
class WorkoutPlanExerciseDBModal {
  static async get(filter?: Filter<WorkoutPlanExercise>): Promise<WorkoutPlanExercise[]> {
    console.log("WPE filter", filter)
    let params = filter && Object.keys(filter).length > 0
                  ? '?filters=' + encodeURIComponent(JSON.stringify(filter))
                  : '';
    // Iterate over the filter object and append to params string
    console.log("WPE param", params)
    const apiUrl = await API_URL();
    const rawResult = await axios.get(`${apiUrl}/api/workout-plan-exercises${params}`).then(res => res.data.data);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult : []
  }
}
class WorkoutPlanDBModal {
  static async get(filter?: Filter<WorkoutPlan>): Promise<WorkoutPlan[]> {

    let params = filter && Object.keys(filter).length > 0
                  ? '?filters=' + encodeURIComponent(JSON.stringify(filter))
                  : '';
    // Iterate over the filter object and append to params string
  
    const apiUrl = await API_URL();
    const rawResult = await axios.get(`${apiUrl}/api/workout-plans${params}`).then(res => res.data.data);
    console.log("Raw results for WorkoutPlan array: ", rawResult )

    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult : []
  }

  static async insert(content: Partial<WorkoutPlan>): Promise<void>{
     
    const apiUrl = await API_URL();
    await axios.post(`${apiUrl}/api/workout-plans`,content).then(res => console.log('Inserted successfully: ', res.data))
                                                       .catch(err => console.log('Error inserting', err));
  }
}

class GoalDBModal {
  static async get(filter?: Filter<Goal> ): Promise<Goal[]> {

    let params = filter && Object.keys(filter).length > 0
                  ? '?filters=' + encodeURIComponent(JSON.stringify(filter))
                  : '';
    const userId = await getUserId();
    if (!userId) {
      console.error('❌ GoalDBModal: No user ID available');
      return [];
    }
    const apiUrl = await API_URL();
    const  rawResult = await axios.get(`${apiUrl}/api/users/${userId}/goals${params}`).then(res => res.data.data);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult : []

  }
  
  static async updateGoal(id: number, updates: Partial<Goal>): Promise<void>{
    // Only the completed column may be updated
    // since it's single maybe just making the updates as a boolean is better but just in case
    const submit = {
        // Note: Goal interface doesn't have completed field, might need to use target_value or other field
        ...updates
    }
    const userId = await getUserId();
    if (!userId) {
      console.error('❌ GoalDBModal: No user ID available for update');
      return;
    }
    const apiUrl = await API_URL();
    await axios.put(`${apiUrl}/api/users/${userId}/goals/${id}`, submit).then(res => console.log('Updated successfully: ', res.data))
  }

  static async insert(content: Partial<Goal>): Promise<void>{
    const userId = await getUserId();
    if (!userId) {
      console.error('❌ GoalDBModal: No user ID available for insert');
      return;
    }
    const apiUrl = await API_URL();
    await axios.post(`${apiUrl}/api/users/${userId}/goals`,content).then(res => console.log('Inserted successfully: ', res.data))
                                                            .catch(err => console.log('Error inserting', err));
  }
}
export { AchievementDBModal, ExerciseDBModal, GuideDBModal, WorkoutPlanExerciseDBModal, FoodDBModal, dropall, WorkoutPlanDBModal, GoalDBModal, MealLogDBModal };



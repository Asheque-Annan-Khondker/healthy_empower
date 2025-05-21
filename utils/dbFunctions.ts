import { Achievement, Exercise, Food, Goal, Guide, MealLog, WorkoutPlan } from "./table.types";
import axios from "axios";
import { API_URL } from "@/constants/DBAPI";
import { USER_ID } from "@/components/auth/SignUp";
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
  await axios.delete(`${API_URL}/api/foods`)
  } catch(err){console.error('Can\'t drop | wont drop', err)}
}
class AchievementDBModal {
  static async getAll(): Promise<Achievement[]> {
  const rawResult = await axios.get(`${API_URL}/api/${USER_ID}/achievements`).then(res=>res.data);
    return Array.isArray(rawResult)? rawResult : []
  }

  static async getById(id: number): Promise<Achievement | null> {
    //TODO: Learn how to request from  property
    const rawResult = await axios.get(`${API_URL}/api/${USER_ID}/achievements?achievement_id=${id}`);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult[0] : null;
  }

  static async updateAchievement(id: number, updates: Partial<Achievement>): Promise<void>{
    // Only the completed and progress properties may be updated. the progress may only rise too 100

    
  }
}

class ExerciseDBModal {
  static async get(filter?: Filter<Exercise>): Promise<Exercise[]> {

    let params = filter && Object.keys(filter).length > 0
                  ? '?filters=' + encodeURIComponent(JSON.stringify(filter))
                  : '';
    const rawResult = await axios.get(`${API_URL}/api/exercises${params}`).then(res=>res.data.data);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult : []
  }

  static async getById(id: number): Promise<Exercise | null> {
    //TODO: Learn how to request from  property
    const rawResult = await axios.get(`${API_URL}/api/exercises?exercise_id=${id}`);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult[0] : null;  
  }
}

class GuideDBModal {
  static async get(filter?: Filter<Guide>): Promise<Guide[]> {
    let params = filter && Object.keys(filter).length > 0
                  ? '?filters=' + encodeURIComponent(JSON.stringify(filter))
                  : '';
    const rawResult = await axios.get(`${API_URL}/api/workout-plans${params}`).then(res => res.data.data);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult : []
  }

}

class FoodDBModal {
  static async get(filter?: Filter<Food>): Promise<Food[]> {
    
    let params = filter && Object.keys(filter).length > 0
                  ? '?filters=' + encodeURIComponent(JSON.stringify(filter))
                  : '';
    // Iterate over the filter object and append to params string
    
    
    const url = `${API_URL}/api/foods${params}`
    const res = await axios.get(url).then(res => res.data.data);
    return Array.isArray(res) && res.length > 0 ? res : []
  }
  static async insert(content: Partial<Food>): Promise<void>{
    const submit = {
      name: content.name,
      calories: content.calories,
      protein: content.protein,
      carbs: content.carbs,
      fat: content.fat,
      serving_size: content.serving_size,
      serving_unit_id: content.serving_unit_id
    }
    await axios.post(`${API_URL}/api/foods`, submit).then(res => console.log('Inserted successfully: ', res.data))
                                                       .catch(err => console.log('Error inserting', err));
  }
  

}
class MealLogDBModal {
  static async get(filter?: Filter<MealLog>): Promise<MealLog[]> {
    let params = filter && Object.keys(filter).length > 0
                  ? '?filters=' + encodeURIComponent(JSON.stringify(filter))
                  : '';
    // Iterate over the filter object and append to params string
    const rawResult = await axios.get(`${API_URL}/api/users/${USER_ID}/meal-logs${params}`).then(res => res.data.data);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult : []
  }
}

class WorkoutPlanDBModal {

  static async getAll(): Promise<WorkoutPlan[]> {
    const rawResult = await axios.get(`${API_URL}/api/workout-plans`).then(res => res.data);
    let resultBool = Array.isArray(rawResult);
    let varResult = rawResult;
    if (API_URL === "http://192.168.1.134:3001") {
      varResult = rawResult.data
      resultBool = Array.isArray(varResult)
    }
    console.log("Raw results for WorkoutPlan array: ", varResult )
    return resultBool? varResult : []
  }
  static async insert(content: Partial<WorkoutPlan>): Promise<void>{
    
      await axios.post(`${API_URL}/api/workout-plans`,content).then(res => console.log('Inserted successfully: ', res.data))
                                                      .catch(err => console.log('Error inserting', err));
  }

  static async getById(id: number): Promise<WorkoutPlan | null> {
    try {
      // Change this line - use path parameter instead of query parameter
      const response = await axios.get(`${API_URL}/api/workout-plans/${id}`);
      
      // Check if we received data
      if (response.data) {
        console.log("Retrieved workout plan with ID:", id);
        return response.data;
      } else {
        console.log("No workout plan found with ID:", id);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching workout plan with ID ${id}:`, error);
      return null;
    }
  }
}


export interface WorkoutPlanExerciseDTO {
  plan_id: number;
  exercise_id: number;
  sets?: number;
  reps_targets?: number;
  duration?: number; // in seconds
}


export async function getWorkoutPlanWithExercises(planId: number) {
  try {

    const response = await fetch(`${API_URL}/api/workout-plans/${planId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch workout plan: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching workout plan with exercises:", error);
    throw error;
  }
}


export { AchievementDBModal, ExerciseDBModal, GuideDBModal, FoodDBModal, dropall, WorkoutPlanDBModal };

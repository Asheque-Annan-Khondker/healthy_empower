import { Achievement, Exercise, Food, Guide, WorkoutPlan } from "./table.types";
import axios from "axios";
import { API_URL } from "@/constants/DBAPI";
import { USER_ID } from "@/components/auth/SignUp";
//TODO: make a filter function

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
  static async getAll(): Promise<Exercise[]> {
const rawResult = await axios.get(`${API_URL}/api/exercises`).then(res=>res.data);
    return Array.isArray(rawResult)? rawResult : []
  }

  static async getById(id: number): Promise<Exercise | null> {
    //TODO: Learn how to request from  property
const rawResult = await axios.get(`${API_URL}/api/exercises?exercise_id=${id}`);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult[0] : null;  }
}

class GuideDBModal {
  static async getAll(): Promise<Guide[]> {
const rawResult = await axios.get(`${API_URL}/api/workout-plans`).then(res => res.data);
    return Array.isArray(rawResult)? rawResult : []
  }

  static async getById(id: number): Promise<Guide | null> {
    //TODO: Learn how to request from  property
const rawResult = await axios.get(`${API_URL}/api/${USER_ID}/`);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult[0] : null;
  }
}

class FoodDBModal {
  static async getAll(): Promise<Food[]> {
    const rawResult = await axios.get(`${API_URL}/api/foods`).then(res => res.data.foods);
    console.log("Raw results for food array: ", rawResult )
    return Array.isArray(rawResult)? rawResult : []
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
  static async getById(id: number): Promise<Food | null> {
    //TODO: Learn how to request from  property
const rawResult = await axios.get(`${API_URL}/api/foods?food_id=${id}`).then(res=>res.data);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult[0] : null;
  }
}

class WorkoutPlanDBModal {
  static async getAll(): Promise<WorkoutPlan[]> {
    const rawResult = await axios.get(`${API_URL}/api/workout-plans`).then(res => res.data);
    console.log("Raw results for WorkoutPlan array: ", rawResult )
    return Array.isArray(rawResult)? rawResult : []
  }
  static async insert(content: Partial<WorkoutPlan>): Promise<void>{
     
      await axios.post(`${API_URL}/api/workout-plans`,content).then(res => console.log('Inserted successfully: ', res.data))
                                                       .catch(err => console.log('Error inserting', err));
  }
  static async getById(id: number): Promise<WorkoutPlan | null> {
    //TODO: Learn how to request from  property
const rawResult: WorkoutPlan = await axios.get(`${API_URL}/api/workout-plans?plan_id=${id}`).then(res=>res.data);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult[0] : null;
  }
}


export { AchievementDBModal, ExerciseDBModal, GuideDBModal, FoodDBModal, dropall, WorkoutPlanDBModal };

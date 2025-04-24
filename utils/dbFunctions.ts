// import { getDatabase } from "./database";
import { Achievement, Exercise, Food, Guide } from "./table.types";
import { SQLiteDatabase } from "expo-sqlite";
import axios from "axios";
import { API_URL } from "@/constants/DBAPI";
import { USER_ID } from "@/components/auth/SignUp";
//TODO: make a filter function

async function dropall(): Promise<void>{
  try {
  await axios.delete(`${API_URL}/api/foods`)
  } catch(err){console.error('Can\'t drop | wont drop', err)}
}

class AchievementDBModal {
  static async getAll(): Promise<Achievement[]> {
const rawResult = await axios.get(`${API_URL}/api/${USER_ID}/achievements`);
    return Array.isArray(rawResult)? rawResult : []


  }
  static async getById(id: number): Promise<Achievement | null> {
    //TODO: Learn how to request from  property
const rawResult = await axios.get(`${API_URL}/api/${USER_ID}/`);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult[0] : null;
  }

  static async updateAchievement(id: number, updates: Partial<Achievement>): Promise<void>{

    
  }
}

class ExerciseDBModal {
  static async getAll(): Promise<Exercise[]> {
const rawResult = await axios.get(`${API_URL}/api/exercises`);
    return Array.isArray(rawResult)? rawResult : []
  }

  static async getById(id: number): Promise<Exercise | null> {
    //TODO: Learn how to request from  property
const rawResult = await axios.get(`${API_URL}/api/exercises/${id}`);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult[0] : null;  }
}

class GuideDBModal {
  static async getAll(): Promise<Guide[]> {
const rawResult = await axios.get(`${API_URL}/api/workout-plans`);
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

export { AchievementDBModal, ExerciseDBModal, GuideDBModal, FoodDBModal, dropall }

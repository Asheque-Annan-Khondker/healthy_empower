// import { getDatabase } from "./database";
import { Achievement, Exercise, Food, Guide } from "./table.types";
import { SQLiteDatabase } from "expo-sqlite";
class DBModal {
  protected static db: any = null
  static async init(dbConnection:SQLiteDatabase) {

    if (!this.db)
      this.db = dbConnection;
      console.log("Connection Established")
    return this.db;
  }
  // protected static async getDB(): Promise<any> {
  //   if (!this.db)
  //     this.db = await getDatabase();
  //   return this.db;
  //   
  // }
  public static async setDBData(insertions: string[]): Promise<void>{
    try {

      for(const sql of insertions){
        await this.db.execAsync(sql)
      }
    }
    catch (error){
      console.error("Error initializing database:", error);
    }


  }
  public static async terminateConnection(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

//TODO: make a filter function

class AchievementDBModal extends DBModal{
  static async getAll(): Promise<Achievement[]> {
    const rawResults = await this.db.getAllAsync("SELECT * FROM Achievements");
    return Array.isArray(rawResults)? rawResults : []


  }
  static async getById(id: number): Promise<Achievement | null> {
    const rawResult = await this.db.getAllAsync(`SELECT * FROM Achievements WHERE id = ?`, [id]);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult[0] : null;
  }

  static async updateAchievement(id: number, updates: Partial<Achievement>): Promise<void>{

    
  }
}

class ExerciseDBModal extends DBModal{
  static async getAll(): Promise<Exercise[]> {
    const rawResults = await this.db.getAllAsync("SELECT * FROM Exercises");
    return Array.isArray(rawResults)? rawResults : []
  }

  static async getById(id: number): Promise<Exercise | null> {
    const rawResult = await this.db.getAllAsync(`SELECT * FROM Exercises WHERE id = ?`, [id]);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult[0] : null;
  }
}

class GuideDBModal extends DBModal{
  static async getAll(): Promise<Guide[]> {
    const rawResults = await this.db.getAllAsync("SELECT * FROM Guides");
    return Array.isArray(rawResults)? rawResults : []
  }

  static async getById(id: number): Promise<Guide | null> {
    const rawResult = await this.db.getAllAsync(`SELECT * FROM Guides WHERE id = ?`, [id]);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult[0] : null;
  }
}

class FoodDBModal extends DBModal{
  static async getAll(): Promise<Food[]> {
    const rawResults = await this.db.getAllAsync("SELECT * FROM Food");
    return Array.isArray(rawResults)? rawResults : []
  }

  static async getById(id: number): Promise<Food | null> {
    const rawResult = await this.db.getAllAsync(`SELECT * FROM Food WHERE id = ?`, [id]);
    return Array.isArray(rawResult) && rawResult.length > 0 ? rawResult[0] : null;
  }
}

export {DBModal, AchievementDBModal, ExerciseDBModal, GuideDBModal, FoodDBModal }

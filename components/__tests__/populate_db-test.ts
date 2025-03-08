import * as SQLite from 'expo-sqlite'
import { getDatabase } from '../../utils/database'

export async function setupTestDB(){
    let db = await getDatabase()

    //clear existing entries
    await db.execAsync(`
        DELETE FROM food_entries;
        DELETE FROM exercies_entries;
        DELETE FROM achievements;
        `)

        //insert test data
        await db.execAsync(`
            INSERT INTO food_entries (name, colories, protein, carbs, fat, date, meal_type)
            VALUES
             ('Test Chicken Salad', 350, 30, 15, 12, '2025-03-05', 'lunch'),
      ('Test Protein Shake', 220, 25, 10, 5, '2025-03-05', 'snack');
       INSERT INTO exercise_entries (type, custom_name, sets, reps, date, notes)
    VALUES
      ('strength', 'Test Bench Press', 3, 10, '2025-03-05', 'Felt strong!'),
      ('cardio', 'Test Running', NULL, NULL, '2025-03-04', '5km run');
  
      `)
      return db
}
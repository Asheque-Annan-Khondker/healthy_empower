// utils/database.ts
import  * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

async function initializeDatabase() {


  // check for build only mode

  if (Platform.OS === 'web'  || process.env.EXPO_BUILD_ONLY==='true')
    return mockDatabase();

  const db = await SQLite.openDatabaseAsync('healthy_empower.db');
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    -- Create food entries table
    CREATE TABLE IF NOT EXISTS food_entries (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      calories INTEGER NOT NULL,
      protein REAL,
      carbs REAL,
      fat REAL,
      date TEXT NOT NULL,
      meal_type TEXT NOT NULL
    );

    -- Create exercise entries table
    CREATE TABLE IF NOT EXISTS exercise_entries (
      id INTEGER PRIMARY KEY,
      type TEXT NOT NULL,
      custom_name TEXT,
      sets INTEGER,
      reps INTEGER,
      duration INTEGER,
    
      date TEXT NOT NULL,
      notes TEXT
    );

    -- Create achievements table
    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      progress INTEGER NOT NULL DEFAULT 0,
      completion_date TEXT
    );

    -- Create exercise guides table
    CREATE TABLE IF NOT EXISTS exercise_guides (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      difficulty TEXT
      category TEXT NOT NULL,
      steps TEXT NOT NULL
    );
  `);
  
  console.log('Database initialized successfully');
  return db;
}

// Export the database instance
let dbPromise = initializeDatabase();
export const getDatabase = () => dbPromise;

// Example of how to use this in other files:
// import { getDatabase } from '@/utils/database';
// const db = await getDatabase();

// for build process since expo-sqlite is not meant for builds

function mockDatabase(){
  console.log("Mock for build processes")
  return {
    execAsync: async ()=>{},
    getAllAsync: async ()=>{},
    getAsync: async ()=> null,
    runAsync: async ()=>({lastInsertRowId: -1, changes: 0})
  }
}
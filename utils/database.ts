// utils/database.ts
import  * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { Exercise, Achievement, Guides } from './table.types';
import { DBModal } from './dbFunctions';
//TODO: refactor in ORM

export async function initializeDatabase() {


  // check for build only mode

  if (Platform.OS === 'web'  || process.env.EXPO_BUILD_ONLY==='true')
    return mockDatabase();

  const db = await SQLite.openDatabaseAsync('healthy_empower.db');
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    -- Create food entries table
    CREATE TABLE IF NOT EXISTS Food (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      calories INTEGER NOT NULL,
      protein REAL default 0,
      carbs REAL default 0,
      fat REAL default 0,
      date TEXT NOT NULL,
      meal_type TEXT NOT NULL
    );

    -- Create exercise entries table
    CREATE TABLE IF NOT EXISTS Exercises (
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
    CREATE TABLE IF NOT EXISTS Achievements (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      category text,
      completed boolean NOT NULL DEFAULT FALSE,
      progress INTEGER NOT NULL DEFAULT 0,
      target_progress integer not null,
      completion_date TEXT,
      xp INTEGER default 0
    );

    -- Create exercise guides table
    CREATE TABLE IF NOT EXISTS Guides (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      difficulty TEXTs,
      category TEXT NOT NULL,
      steps TEXT NOT NULL
    );
  `);
  
  console.log('Database initialized successfully');
  DBModal.init(db);
}
// // Export the database instance
// let dbPromise = initializeDatabase();
// export const getDatabase = () => dbPromise;

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

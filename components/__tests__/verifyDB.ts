import { setupTestDB } from "./populate_db-test";

async function verifyDatabase() {
    try {
    console.log('🏋️‍♀️ Setting up test database...');
    const db = await setupTestDB();
    
    console.log('🍽️ Checking food entries...');
    const foods = await db.getAllAsync('SELECT * FROM food_entries');
    console.table(foods);
    
    console.log('💪 Checking exercise entries...');
    const exercises = await db.getAllAsync('SELECT * FROM exercise_entries');
    console.table(exercises);
    
    console.log('✅ Database verification complete!');
  } catch (error) {
    console.error('❌ Database error:', error);
  }
}
verifyDatabase()
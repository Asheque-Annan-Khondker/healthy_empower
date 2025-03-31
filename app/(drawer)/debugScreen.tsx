import{ useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import { getDatabase } from '../../utils/database';
import GuideCardList from '@/components/CardDetails';
import { react_logo } from '@/assets/images';
import React from 'react';
import ScreenTransition from '@/components/screenTransition';
import CalorieDashboard from '@/components/diet/CalorieDashboard';

export default function DebugDatabaseScreen() {
  const [foodEntries, setFoodEntries] = useState([]);
  const [exerciseEntries, setExerciseEntries] = useState([]);
  const [message, setMessage] = useState('Loading...');
  const [error, setError] = useState(null);

  async function setupTestData() {
    try {
      setError(null)
      setMessage('Setting up test data...');
      const db = await getDatabase();
      
      await db.execAsync(`
        DELETE FROM food_entries;
        DELETE FROM exercise_entries;
        DELETE FROM achievements;
        
        INSERT INTO food_entries (name, calories, protein, carbs, fat, date, meal_type)
        VALUES
          ('Test Chicken Salad', 20, 30, 15, 12, '2025-03-05', 'lunch'),
          ('Test Protein Shake', 220, 25, 10, 5, '2025-03-25', 'snack'),
          ('Test Protein Shake', 220, 25, 10, 5, '2025-03-25', 'snack'),
          ('Test Protein Shake', 220, 25, 10, 5, '2025-03-25', 'snack');
          
        INSERT INTO exercise_entries (type, custom_name, sets, reps, date, notes, duration)
        VALUES
          ('strength', 'Test Bench Press', 3, 10, '2025-03-15', 'Felt strong!', 60),
          ('cardio', 'Test Running', NULL, NULL, '2025-03-04', '5km run', 30);
      `);
      
      loadData();
      setMessage('Test data loaded successfully!');
    } catch (err) {
      console.error(err);
      setError(`Error: ${err.message}`);
    }
  }

  async function loadData() {
    try {
      const db = await getDatabase();
      const foods = await db.getAllAsync('SELECT * FROM food_entries');
      setFoodEntries(foods);
      
      const exercises = await db.getAllAsync('SELECT * FROM exercise_entries');
      setExerciseEntries(exercises);
    } catch (err) {
      setError(`Error loading data: ${err.message}`);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Database Debug</Text>
      
      <Button title="Reset & Load Test Data" onPress={setupTestData} />
      
      {error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.message}>{message}</Text>
      
      <Text style={styles.heading}>Food Entries:</Text>
      {foodEntries.map(food => (
        <View key={food.id} style={styles.item}>
          <Text>Name: {food.name}</Text>
          <Text>Calories: {food.calories}</Text>
          <Text>Date: {food.date}</Text>
        </View>
      ))}
      
      <Text style={styles.heading}>Exercise Entries:</Text>
      {exerciseEntries.map(ex => (
        <View key={ex.id} style={styles.item}>
            <Text>{`
            Type: ${ex.type}, 
            Name: ${ex.custom_name}, 
            Date: ${ex.date}, 
            Reps: ${ex.reps}, 
            Sets: ${ex.sets}, 
            Minutes: ${ex.duration}min
            `}</Text>
        </View>
      ))}

      <View style={{margin:20}}>
      <ScreenTransition>
      <GuideCardList horizontal={true} cards={cards} />
      <CalorieDashboard/>
      </ScreenTransition>
      </View>
    </ScrollView>
  );
}
const cards = [

    {img: react_logo, title: "React", description:"This is the react logo", link:'https://reactjs.org'},
    {img: react_logo, title: "React", description:"This is the react logo", link:'https://reactjs.org'},
    {img: react_logo, title: "React", description:"This is the react logo", link:'https://reactjs.org'},
    {img: react_logo, title: "React", description:"This is the react logo", link:'https://reactjs.org'},
]
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  heading: { fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  item: { padding: 12, marginVertical: 4, backgroundColor: '#f0f0f0', borderRadius: 8 },
  message: { padding: 8, marginTop: 8 },
  error: { padding: 8, color: 'red', backgroundColor: '#ffeeee' }
});
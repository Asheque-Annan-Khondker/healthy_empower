import{ useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import {CustomCardList} from '@/components/CardDetails';
import { react_logo } from '@/assets/images';
import React from 'react';
import ScreenTransition from '@/components/screenTransition';
import CalorieDashboard from '@/components/diet/CalorieDashboard';
import { Achievement, Exercise, Food } from '@/utils/table.types';
import { AchievementDBModal, DBModal, ExerciseDBModal, FoodDBModal } from '@/utils/dbFunctions';
import MealEntryForm from "@/components/diet/MealEntryForm";
import DropdownMenu from "@/components/DropdownMenu";

export default function DebugDatabaseScreen() {
  //Todo: Add type safety for the content of the state objects
  const [foodEntries, setFoodEntries] = useState<Food[]>([]);
  const [exerciseEntries, setExerciseEntries] = useState<Exercise[]>([]);
  const [achievementEntries, setAchievementEntries] = useState<Achievement[]>([]);
  const [message, setMessage] = useState('Loading...');
  const [error, setError] = useState(null);
  
  async function setupTestData() {
    try {
      setError(null)
      setMessage('Setting up test data...');
      console.log("insertion starting")
      await DBModal.setDBData(sqlCommands)
        console.log("insertion complete")
        console.log("Load Test Data")
        loadData();
        setMessage('Test data loaded successfully!');
      } catch (err) {
        console.error(err);
      }
    }
    
    async function loadData() {
      try {
        setFoodEntries(await FoodDBModal.getAll());;
        setExerciseEntries(await ExerciseDBModal.getAll());
        setAchievementEntries(await AchievementDBModal.getAll());
      } catch (err) {
        setError(`Error loading data: ${err.message}`);
      }
    }
    
    useEffect(() => {
      setupTestData()
    }, []);
    
    return (
      <ScrollView style={styles.container}>
        <ScreenTransition slideDirection='left'>
      <Text style={styles.title}>Database Debug</Text>
      
      <Button title="Reset & Load Test Data" onPress={setupTestData} />
      
      {error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.message}>{message}</Text>

          <MealEntryForm/>
      <Text style={styles.heading}>Food Entries:</Text>
      {foodEntries.map(food => (
        <View key={food.id} style={styles.item}>
          <Text>{`
          Type: ${food.name},
          Calorie: ${food.calories},
          Date: ${food.date}
          `}</Text>
        </View>
      ))}
       
      <Text style={styles.heading}>Achievement Entries</Text>
      {achievementEntries.map(achievement => (
        <View key={achievement.id} style={styles.item}>
          <Text>{`
          Type: ${achievement.category},
          Title: ${achievement.title},
          XP: ${achievement.xp},
          completed: ${Boolean(achievement.completed)}
          `}</Text>
        </View>
      ))}

      <Text style={styles.heading}>Exercise Entries:</Text>
      {exerciseEntries.map(ex => (
        <View key={ex.id} style={styles.item}>
        <Text>{`
            Name: ${ex.name}, 
            Reps: ${ex.reps}, 
            Sets: ${ex.sets}, 
            Minutes: ${ex.duration}min
            `}</Text>
          </View>
        ))}
        
        <View style={{margin:20}}>
        <ScreenTransition>
        <CustomCardList horizontal={true} cards={cards} />
        <CalorieDashboard/>
          <DropdownMenu />
        </ScreenTransition>
        </View>
        </ScreenTransition>
        </ScrollView>
      );
    }
    const sqlCommands = [
      'DELETE FROM Food;',
      'DELETE FROM Exercises;',
      'DELETE FROM Achievements;',
      
      `INSERT INTO Food (name, calories, protein, carbs, fat, date, meal_type)
       VALUES ('Test Chicken Salad', 350, 30, 15, 12, date('now', '-20 days'), 'lunch');`,
      
      `INSERT INTO Food (name, calories, protein, carbs, fat, date, meal_type)
       VALUES ('Test Protein Shake', 220, 25, 10, 5, date('now', '-15 days'), 'snack');`,
      
      `INSERT INTO Food (name, calories, protein, carbs, fat, date, meal_type)
       VALUES ('Test Protein Shake', 220, 25, 10, 5, date('now', '-10 days'), 'snack');`,
      
       `INSERT INTO Food (name, calories, protein, carbs, fat, date, meal_type)
       VALUES ('Test Protein Shake', 1000, 25, 10, 5, date('now', '-5 days'), 'snack');`,
       
      `INSERT INTO Food (name, calories, protein, carbs, fat, date, meal_type)
      VALUES ('Test Protein Shake', 100, 25, 10, 5, date('now', '-2 days'), 'snack');`,
      
      `INSERT INTO Exercises (type, custom_name, sets, reps, date, notes, duration)
       VALUES ('strength', 'Test Bench Press', 3, 10, date('now', '-3 days'), 'Felt strong!', 60);`,
`INSERT INTO Achievements (id, title, description, icon, category, completed, progress, target_progress, completion_date, xp) VALUES
(1, 'First Steps', 'Complete your first task.', 'first_steps.png', 'Beginner', true, 100, 100, '2023-10-01', 50),
(2, 'Halfway There', 'Reach 50% progress in your goal.', 'halfway.png', 'Intermediate', false, 50, 100, NULL, 100),
(3, 'Master Achiever', 'Complete all tasks in the category.', 'master_achiever.png', 'Advanced', false, 100, 100, '2023-09-15', 500);
`       
      // `INSERT INTO achievements (title, description, icon, category, completed, progress, target_progress, completion_date, xp)
      //  VALUES ('First Workout', 'Complete your first workout', 'dumbbell', 'fitness', 1, 1, 1, date('now', '-10 days'), 50);`
    ]

const cards = [
  // Example 1: Direct cardProps object
  {
    onPress: () => console.log('Card 1 pressed'),
    textContent: {
      title: "Beginner Workout",
      subtitle: "30 minutes",
      paragraph: "Perfect for newcomers to fitness"
    },
    icon: {
      iconProps: { icon: 'dumbbell', size: 24 }
    },
    variant: "default"
  },

  // Example 2: Direct cardProps object with different variant
  {
    onPress: () => console.log('Card 2 pressed'),
    textContent: {
      title: "Healthy Meal Plan",
      subtitle: "1500 calories",
      paragraph: "Balanced nutrition for weight management"
    },
    icon: {
      iconProps: { icon: 'food-apple', size: 24 }
    },
    variant: "elevated"
  },



  // Example 4: Another direct cardProps object
  {
    onPress: () => console.log('Card 4 pressed'),
    textContent: {
      title: "Meditation Guide",
      subtitle: "15 minutes",
      paragraph: "Reduce stress with guided meditation"
    },
    icon: {
      iconProps: { icon: 'meditation', size: 24 }
    },
    variant: "default"
  }
]

    const styles = StyleSheet.create({
      container: { flex: 1, padding: 16 },
      title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
      heading: { fontSize: 18, fontWeight: 'bold', marginTop: 16 },
      item: { padding: 12, marginVertical: 4, backgroundColor: '#f0f0f0', borderRadius: 8 },
      message: { padding: 8, marginTop: 8 },
      error: { padding: 8, color: 'red', backgroundColor: '#ffeeee' }
    });

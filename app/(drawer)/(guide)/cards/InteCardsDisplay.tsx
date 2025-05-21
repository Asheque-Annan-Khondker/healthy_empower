import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';

const InteCardsDisplay = () => (
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      {/*Build Muscle*/}
      <Card style={styles.card}>
        <Card.Title title="Building Muscle" />
        <Card.Content>
          <Text variant="bodyMedium">
            Building muscle takes more than just nuts—it takes consistent effort and smart training. Focus on resistance workouts that challenge your body, like a squirrel 
            tackling a tough tree climb. Fuel up with protein-packed snacks to power those gains. Rest is key too—muscles grow during downtime in your cozy nest. Don’t rush the 
            process; like storing acorns, progress stacks up slowly. Stay steady, and soon you’ll be flexing with furry determination!
          </Text>
        </Card.Content>
      </Card>

      {/*Build Endurance*/}
      <Card style={styles.card}>
        <Card.Title title="Building Endurance" />
        <Card.Content>
          <Text variant="bodyMedium">
            Building endurance is a marathon, not a mad squirrel dash! Start with steady-paced activities and gradually add more time—just like collecting acorns bit by bit. 
            Stay hydrated, fuel wisely, and don’t burn out your bushy tail too soon. Keep at it, and you’ll soon be bounding through long workouts like a squirrel on a power line!
          </Text>
        </Card.Content>
      </Card>

      {/*Refining Technique*/}
      <Card style={styles.card}>
        <Card.Title title="Refining Technique" />
        <Card.Content>
          <Text variant="bodyMedium">
            Refining technique takes focus—no shortcuts! Slow down, master the basics, and repeat until it’s second nature. A well-practiced move, like a squirrel’s leap, 
            is all about precision and control. Use mirrors, videos, or trainers to spot nutty mistakes and correct them early. Over time, your movements will feel smooth, efficient, and strong—no 
            flailing, just finely tuned form with every rep!
          </Text>
        </Card.Content>
      </Card>

      {/*Nutrition -Intermediate Goals*/}
      <Card style={styles.card}>
        <Card.Title title="Nutrition Tips for Intermediates" />
        <Card.Content>
          <Text variant="bodyMedium">
            If you're training to build muscle and endurance, your nutrition must match your hustle. Prioritize protein with every meal—lean meats, eggs, tofu, or Greek yogurt.
            Eat complex carbs like oats, quinoa, and brown rice to sustain energy through intense workouts. Don't skip healthy fats—they help with hormone balance and recovery.
            Stay hydrated, plan your meals ahead, and use food to fuel—not just fill—you. Remember, what you eat supports how you train!
          </Text>
        </Card.Content>
      </Card>

      {/*Intermediate Workout plan*/}
      <Card style={styles.card}>
        <Card.Title title="Intermediate Weekly Workout Plan" />
        <Card.Content>
          <Text variant="bodyMedium">Step up your routine with this split:</Text>
          <Text style={styles.day}>💪 Day 1 – Push Workout (Chest, Shoulders, Triceps)</Text>
          <Text style={styles.day}>🦵 Day 2 – Lower Body Strength (Squats, Lunges, RDLs)</Text>
          <Text style={styles.day}>🧘 Day 3 – Active Recovery (Yoga or Stretching)</Text>
          <Text style={styles.day}>💪 Day 4 – Pull Workout (Back, Biceps)</Text>
          <Text style={styles.day}>🔁 Day 5 – Circuit Training (Endurance Focused)</Text>
          <Text style={styles.day}>🚶 Day 6 – Light Cardio + Core (Walk, Bike, Planks)</Text>
          <Text style={styles.day}>😴 Day 7 – Full Rest</Text>
          <Text style={[styles.day, { marginTop: 12 }]}>
            Focus on form, track progress, and listen to your body. You've moved beyond the basics—now it's about consistency and refinement.
          </Text>
        </Card.Content>
      </Card>

    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 16,
  },
  day: {
  marginTop: 8,
  fontSize: 14,
  color: '#444',
},

  container: {
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 20,
    elevation: 3,
    borderRadius: 10,
  },
});

export default InteCardsDisplay;

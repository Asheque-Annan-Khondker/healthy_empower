import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';

const BegCardsDisplay = () => (
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      {/*Build Consistency*/}
      <Card style={styles.card}>
        <Card.Title title="Build Consistency" />
        <Card.Content>
          <Text variant="bodyMedium">
            To build consistency in fitness, don’t go nuts—start small and stash manageable goals like acorns. Stick to a routine you can scurry back to daily. 
            Choose workouts you’ll go nuts for, so it’s not a chore. Track your progress so you don't lose your trail. Even if you slip, don’t squirrel 
            away guilt—just get back to it. With steady effort, you’ll be fit enough to leap branch to branch in no time!
          </Text>
        </Card.Content>
      </Card>

      {/*Learn Form*/}
      <Card style={styles.card}>
        <Card.Title title="Learn Form" />
        <Card.Content>
          <Text variant="bodyMedium">
            Learning proper form in fitness is key—don’t wing it like a wild squirrel leap! Start by watching trusted trainers or tutorials to get the right moves down. 
            Practice slowly to ensure correct form. Use mirrors or record yourself to spot any nutty habits. Remember, even squirrels refine their jumps—so 
            take time, be mindful, and soon you’ll master every rep with precision and tail-flipping confidence!
          </Text>
        </Card.Content>
      </Card>

      {/*Improve General Health*/}
      <Card style={styles.card}>
        <Card.Title title="Improve General Health" />
        <Card.Content>
          <Text variant="bodyMedium">
            Improving your general health is all about gathering good habits—like a squirrel stashing acorns. Stay active daily, even if it’s just a quick scamper 
            around the block. Choose nutritious bites to fuel your energy, and get plenty of rest in your cozy nest. Don’t forget to stretch—limber limbs help
            with every leap. Small steps add up, so stay persistent and playful. Soon, you’ll feel strong enough to conquer any tree in your path!
          </Text>
        </Card.Content>
      </Card>

      {/*Nutrition tips*/}
      <Card style={styles.card}>
        <Card.Title title="Nutrition Goals & Tips" />
        <Card.Content>
          <Text variant="bodyMedium">
            Fuel your body like a smart squirrel: eat real, whole foods often! Focus on balanced meals with protein, carbs, and healthy fats. 
            Stay hydrated—water is your best friend. Don’t skip meals; aim for steady energy throughout the day. 
            Start simple: add veggies to every meal, swap sugary snacks for fruit or nuts, and prepare your own meals when you can. 
            Consistency beats perfection. The better you fuel, the better you feel - and move!
          </Text>
        </Card.Content>
      </Card>

      {/*Beginner Workout Guide*/}
      <Card style={styles.card}>
        <Card.Title title="Beginner Workout Plan" />
        <Card.Content>
          <Text variant="bodyMedium">Here’s a simple weekly plan to get moving:</Text>
          <Text style={styles.day}>🟢 Day 1 – Full Body Warm-Up and 15-min Walk</Text>
          <Text style={styles.day}>🟡 Day 2 – Bodyweight Squats, Wall Push-Ups, Glute Bridges</Text>
          <Text style={styles.day}>🔵 Day 3 – Rest or light yoga</Text>
          <Text style={styles.day}>🟡 Day 4 – Repeat Day 2 + Add 30-sec Plank</Text>
          <Text style={styles.day}>🟢 Day 5 – Go for a light jog or bike ride</Text>
          <Text style={styles.day}>🔵 Day 6 – 30-min walk</Text>
          <Text style={styles.day}>🟤 Day 7 – Full Rest + Reflect on the week</Text>
          <Text style={[styles.day, { marginTop: 12 }]}>
            Progress slowly and celebrate small wins. Your journey starts here!
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

export default BegCardsDisplay;

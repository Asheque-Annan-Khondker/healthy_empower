import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';

const ExpertCardsDisplay = () => (
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      {/*Optimising Performance*/}
      <Card style={styles.card}>
        <Card.Title title="Optimising Performance" />
        <Card.Content>
          <Text variant="bodyMedium">
            To optimize your fitness performance, stay nimble and quick like a squirrel weaving through trees. Mix strength training with cardio to build power and stamina. 
            Focus on rest and recovery to keep your tail bushy and energy high. Fuel your body with nutrient-rich snacks, just like a squirrel packs away acorns. Consistent 
            practice sharpens your skills, so leap confidently and tackle challenges with squirrel-like agility and speed.
          </Text>
        </Card.Content>
      </Card>

      {/*Optimising Aesthetics*/}
      <Card style={styles.card}>
        <Card.Title title="Optimising Aesthetics" />
        <Card.Content>
          <Text variant="bodyMedium">
            For the best physique, treat your workouts like a squirrel carefully gathering acorns—consistent and strategic. Combine resistance training to build 
            muscle with cardio to stay lean. Eat clean, focusing on protein and wholesome foods to fuel growth and recovery. Hydration and sleep are your cozy nest, 
            helping your body shape and repair. Patience is key—like squirrels storing nuts for winter, aesthetic gains come with steady dedication and time.
          </Text>
        </Card.Content>
      </Card>

      {/*Optimising Competition Prep*/}
      <Card style={styles.card}>
        <Card.Title title="Optimising Competition Prep" />
        <Card.Content>
          <Text variant="bodyMedium">
            Competition prep is the art of refinement. Like a squirrel gathering only the ripest acorns, focus your workouts for precision and outcome.  
            Taper workouts as your event approaches, maintain discipline in diet, and dial in recovery. Mental prep is as important as physical — visualize success, plan routines, and rehearse transitions.  
            It’s not just training — it’s performance execution. 
          </Text>
        </Card.Content>
      </Card>

      {/*Nutrition experts*/}
      <Card style={styles.card}>
        <Card.Title title="Nutrition Goals for Experts" />
        <Card.Content>
          <Text variant="bodyMedium">
            Expert-level nutrition means tracking macros, cycling carbs, and aligning your meals with your training cycle. Focus on performance fuel—high-quality proteins, complex carbs, and healthy fats in precise amounts.  
            Consider timing: pre- and post-workout meals should optimize strength and recovery. Supplement wisely (creatine, BCAAs, omega-3s) and hydrate meticulously. Like a squirrel choosing only the best nuts, precision fuels elite performance.
          </Text>
        </Card.Content>
      </Card>

      {/*Expert Guide*/}
      <Card style={styles.card}>
        <Card.Title title="Expert Training Strategy" />
        <Card.Content>
          <Text variant="bodyMedium">Structure your week for volume, recovery, and performance peaks:</Text>
          <Text style={styles.day}>🔥 Day 1 – Upper Body Power (Press, Pull, Rows)</Text>
          <Text style={styles.day}>⚡ Day 2 – Body Conditioning (sleds, jump rope)</Text>
          <Text style={styles.day}>🦵 Day 3 – Lower Body Strength (Squats, Deadlifts)</Text>
          <Text style={styles.day}>🧘 Day 4 – Recovery & Mobility (Yoga, deep stretch)</Text>
          <Text style={styles.day}>💪 Day 5 – Push/Pull Hypertrophy</Text>
          <Text style={styles.day}>🚴 Day 6 – Mixed Cardio</Text>
          <Text style={styles.day}>😴 Day 7 – Full Rest</Text>
          <Text style={[styles.day, { marginTop: 12 }]}>
            Rotate intensity every 4–6 weeks. Track progress. Refine technique.
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
  container: {
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 20,
    elevation: 3,
    borderRadius: 10,
  },
  day: {
    marginTop: 8,
    fontSize: 14,
    color: '#444',
  },
});

export default ExpertCardsDisplay;

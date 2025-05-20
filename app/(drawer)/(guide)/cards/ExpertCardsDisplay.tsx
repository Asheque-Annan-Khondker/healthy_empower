import * as React from 'react';
import { View } from 'react-native';
import { Text, Card } from 'react-native-paper';


const ExpertCardsDisplay = () => (
  <View>
    <Card>
      <Card.Title title="Optimising Performance" />
      <Card.Content>
        <Text variant="bodyMedium">
          To optimize your fitness performance, stay nimble and quick like a squirrel weaving through trees. Mix strength training with cardio to build power and stamina. 
          Focus on rest and recovery to keep your tail bushy and energy high. Fuel your body with nutrient-rich snacks, just like a squirrel packs away acorns. Consistent 
          practice sharpens your skills, so leap confidently and tackle challenges with squirrel-like agility and speed.
        </Text>
      </Card.Content>
    </Card>
    <Card>
      <Card.Title title="Optimising Aesthetics" />
      <Card.Content>
        <Text variant="bodyMedium">
          For the best physique, treat your workouts like a squirrel carefully gathering acorns—consistent and strategic. Combine resistance training to build 
          muscle with cardio to stay lean. Eat clean, focusing on protein and wholesome foods to fuel growth and recovery. Hydration and sleep are your cozy nest, 
          helping your body shape and repair. Patience is key—like squirrels storing nuts for winter, aesthetic gains come with steady dedication and time.
        </Text>
      </Card.Content>
    </Card>
    <Card>
      <Card.Title title="Optimising Competition Prep" />
      <Card.Content>
        <Text variant="bodyMedium">
          Building muscle takes more than just nuts—it takes consistent effort and smart training. Focus on resistance workouts that challenge your body, like a squirrel 
          tackling a tough tree climb. Fuel up with protein-packed snacks to power those gains. Rest is key too—muscles grow during downtime in your cozy nest. Don{"\'"}t rush the 
          process; like storing acorns, progress stacks up slowly. Stay steady, and soon you{"\'"}ll be flexing with furry determination!
        </Text>
       </Card.Content>
    </Card>
  </View>
  
);

export default ExpertCardsDisplay;
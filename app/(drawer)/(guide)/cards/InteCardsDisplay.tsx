import * as React from 'react';
import { View } from 'react-native';
import { Text, Card } from 'react-native-paper';


const InteCardsDisplay = () => (
  <View>
    <Card>
      <Card.Title title="Building Muscle" />
      <Card.Content>
        <Text variant="bodyMedium">
          Building muscle takes more than just nuts—it takes consistent effort and smart training. Focus on resistance workouts that challenge your body, like a squirrel 
          tackling a tough tree climb. Fuel up with protein-packed snacks to power those gains. Rest is key too—muscles grow during downtime in your cozy nest. Don{"\'"}t rush the 
          process; like storing acorns, progress stacks up slowly. Stay steady, and soon you{"\'"}ll be flexing with furry determination!
        </Text>
      </Card.Content>
    </Card>
    <Card>
      <Card.Title title="Building Endurance" />
      <Card.Content>
        <Text variant="bodyMedium">
          Building endurance is a marathon, not a mad squirrel dash! Start with steady-paced activities and gradually add more time—just like collecting acorns bit by bit. 
          Stay hydrated, fuel wisely, and don{"\'"}t burn out your bushy tail too soon. Keep at it, and you{"\'"}ll soon be bounding through long workouts like a squirrel on a power line!
        </Text>
      </Card.Content>
    </Card>
    <Card>
      <Card.Title title="Refining Technique" />
      <Card.Content>
        <Text variant="bodyMedium">
          Refining technique takes focus—no shortcuts! Slow down, master the basics, and repeat until it{"\'"}s second nature. A well-practiced move, like a squirrel{"\'"}s leap, 
          is all about precision and control. Use mirrors, videos, or trainers to spot nutty mistakes and correct them early. Over time, your movements will feel smooth, efficient, and strong—no 
          flailing, just finely tuned form with every rep!
        </Text>
     </Card.Content>
    </Card>
  </View>
  
);

export default InteCardsDisplay;
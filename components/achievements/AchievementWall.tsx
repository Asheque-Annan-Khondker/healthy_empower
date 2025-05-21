import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { List, Surface, Text, Avatar, Divider, Badge, Card, Title, Paragraph, ProgressBar, useTheme } from 'react-native-paper';
import { AchievementDBModal} from "@/utils/dbFunctions";
import React from "react";
import { Achievement } from "@/utils/table.types"; // Make sure this import exists
import { useFocusEffect } from "expo-router";

export default function AchievementWall() {
  const [completedAchievementData, setCompletedAchievementData] = useState<Achievement[]>([]);
  const [count, setCount] = useState<number>(0);
  const [completed, setCompleted] = useState<number>(0);
  const [threeBlindAchievements, setThreeBlindAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number| null>(null);
  const theme = useTheme();

    async function fetchData() {
      try {
        const [count, completedCount, completedAchievements, nearbyAchievements] = await retrieveAchievements() as [number, number, Achievement[], Achievement[]];
        console.log(`count: ${count}, completedCount: ${completedCount}, completedAchievements: ${completedAchievements}, nearbyAchievements: ${(nearbyAchievements)}`);
        setCompletedAchievementData(completedAchievements );
        setCount(count );
        setCompleted(completedCount );
        setThreeBlindAchievements(nearbyAchievements );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching achievements:", error);
        setLoading(false);
      }
    }

  //subsequent refreshes
   useFocusEffect(
    useCallback(() => {
      fetchData()
      return () =>{
        console.log("Refreshing Achievements")
      }
    }, [])
  ) 
  const handleAccordionToggle = (id:number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>Loading achievements...</Text>
      </View>
    );
  }

  return (
    <Surface style={styles.container}>
      {/* Progress Summary */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>Achievement Progress</Title>
          <ProgressBar progress={count > 0 ? completed / count : 0} color={theme.colors.primary} style={styles.progressBar} />
          <Text style={styles.progressText}>{completed} of {count} completed</Text>
        </Card.Content>
      </Card>
      
      {/*Completed Achievements */}
      {/*May have to convert to component*/}
      <List.Section title="Completed Achievements">
        {completedAchievementData ? (
          completedAchievementData.map((achievement) => (
            <List.Accordion
              key={achievement.id?.toString()}
              id={achievement.id?.toString()}
              title={achievement.title || 'Unnamed Achievement'}
              description={achievement.description || ''}
              left={props => <Avatar.Icon {...props} icon="trophy" />}
              expanded={expandedId == achievement.id}
              onPress={() => handleAccordionToggle(achievement.id || null)}>
              <List.Item
                title={achievement.title || 'Unnamed Achievement'}
                description={achievement.description || achievement.description || 'No description available'}
                right={props => <Badge {...props} style={styles.badgeComplete}>Completed</Badge>}
              left={props => <Avatar.Icon {...props} icon="trophy" />}
                
              />
              <Divider />
            </List.Accordion>
          ))
        ) : (
          <List.Item title="No achievements completed yet" />
        )}
      </List.Section>

      {/* Nearby Achievements */}
      <List.Section title="Upcoming Achievements">
        {threeBlindAchievements.length > 0 ? (
          threeBlindAchievements.map((achievement) => (
            <List.Item
              key={achievement.id}
              title={achievement.title}
              description={achievement.description }
              left={props => <Avatar.Icon {...props} icon="star-outline" />}
            />
          ))
        ) : (
          <List.Item title="No upcoming achievements found" />
        )}
      </List.Section>
    </Surface>
  );
}

 async function retrieveAchievements(): Promise<[number, number, Achievement[], Achievement[]]> {
  // return an array of achievements, number of achievements and completed

    // use type guarding incase void is returned
    const results = await AchievementDBModal.get()
    console.log("Achievements retrieved: ", results)
    // get count of Achievements
    const count = results.length
    // get completed achievements
    const completed = results.filter((row) => row.completed == true)
    // get and array of completed achievements and the three uncompleted, with closest id after the recent completed
    let threeBlindAchievements: Achievement[] = []  
    // completed may be undefined if there are no subsequent achievements

    if(completed.length > 0){
      const lCompleted = completed.at(-1)
      threeBlindAchievements = results.filter(row => {
      return row.id > lCompleted.id && row.id < lCompleted.id + 3
   })}
  console.log("threeBlindAchievements: ", threeBlindAchievements)
   return [count, completed.length, completed, threeBlindAchievements] 



}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    marginBottom: 16,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  progressText: {
    textAlign: 'center',
  },
  badgeComplete: {
    backgroundColor: 'green',
  }
});


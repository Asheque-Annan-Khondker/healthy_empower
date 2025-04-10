import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenTransition from "@/components/screenTransition";
import { ScrollView } from 'react-native-gesture-handler';
import { FAIcon, IonIcon } from '@/utils/getIcon';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import {Avatar, Card, Paragraph, Searchbar, Title} from "react-native-paper";
import {CustomCardList, CustomCard, cardProps} from '@/components/CardDetails';
import { react_logo } from '@/assets/images';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import {SafeAreaView} from "react-native-safe-area-context";
/*TODO: Implement a MVP of the dashboard. It will have:
*  1. Calorie Graphs
* 2. Achievement cards
* 3. */
export default function Index() {
 const [searchQuery, setSearchQuery] = useState('');
    const metrics = {steps:"", calories: "", hydration:"",recovery:""}
    const navigation = useNavigation()
  return (
        // it is possible to combine search with drawer through paper
<View>
  <ScreenTransition type={"bounce"}>
        <Searchbar placeholder={"Search"} onChangeText={setSearchQuery} value={searchQuery}
                  icon={()=><FAIcon name='bars' color='black'/>} onIconPress={()=>navigation.dispatch(DrawerActions.toggleDrawer())}/>
  <CustomCardList cards={cardPropsTestArray} horizontal={false}/>
  </ScreenTransition>

</View>
        // Make a Level progression graph
  );
}

const healthStats = [
  { label: 'STEPS', value: '8,432', icon: 'footsteps', color: '#5acdff' },
  { label: 'CALORIES', value: '1,842', icon: 'flame', color: '#ff5a87' },
  { label: 'HYDRATION', value: '68%', icon: 'water', color: '#5acdff' },
  { label: 'RECOVERY', value: '87%', icon: 'pulse', color: '#a5ff5a' }
];

const objectives = [
  { 
    title: 'DAILY EXERCISE',
    desc: 'Complete 30 minutes of cardio activity',
    icon: 'fitness',
    progress: 75,
    color: '#5acdff'
  },
  {
    title: 'NUTRITION GOAL',
    desc: 'Stay within macro targets for the day',
    icon: 'nutrition',
    progress: 60,
    color: '#ff5a87'
  },
  { 
    title: 'HYDRATION',
    desc: 'Drink 2L of water throughout the day',
    icon: 'water',
    progress: 80,
    color: '#5acdff'
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Adds shadow for iOS
    shadowOpacity: 0.25, // Adds shadow for iOS
    shadowRadius: 3.84, // Adds shadow for iOS
  },
  header: {
    height: 180,
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerDate: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    letterSpacing: 1,
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 14,
    letterSpacing: 1,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginLeft: 10,
  },
  statsContainer: {
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    height: 100,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  statValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 6,
    fontSize: 12,
    letterSpacing: 1,
  },
  activityContainer: {
    marginBottom: 30,
  },
  objectiveCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  objectiveGradient: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  objectiveIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  objectiveContent: {
    flex: 1,
  },
  objectiveTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  objectiveDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 8,
  },
  progressContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#5acdff',
  },
  objectivePercent: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  navIndicator: {
    height: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navLine: {
    width: 50,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1.5,
  },
});


const cardPropsTestArray: cardProps[] = [
  {
    onPress: () => console.log("Card one pressed! Exciting!"),
    longPress: () => console.log("Whoa! Long press on card one detected!"),
    textContent: {
      title: "Daily Workout Challenge!",
      subtitle: "Ready to feel the burn?!",
      description: "Complete 20 jumping jacks to earn star points!"
    },
    iconProps: {
      icon: "star",
      color: "#FFC107",
      size: 40
    },
    variant: "elevated"
  },
  {
    onPress: () => console.log("Card two activated! Let's go!"),
    mainComponent: <></>,
    textContent: {
      title: "Meditation Session",
      subtitle: "Find your inner peace!",
      paragraph: "Take a five minute break to recharge your mental energy! Even Trailblazers need to rest sometimes!"
    },
    iconProps: {
      icon: "meditation",
      color: "#4CAF50",
      size: 36
    },
    variant: "default"
  },
  {
    onPress: () => console.log("Card three tapped! Amazing!"),
    longPress: () => console.log("Super duper long press on card three!"),
    textContent: {
      title: "Water Reminder!",
      description: "Have you had your 8 glasses today? Stay hydrated for maximum power-ups!"
    },
    iconProps: {
      icon: "water",
      color: "#2196F3",
      size: 42
    },
    variant: "outlined"
  },
  {
    onPress: () => console.log("Card four selected! Yahoo!"),
    textContent: {
      title: "Sleep Tracker",
      subtitle: "Rest well, play better!",
      description: "Track your sleep patterns!",
      paragraph: "Getting 8 hours of sleep improves your reaction time by 35%! That's so many percent!"
    },
    iconProps: {
      icon: "sleep",
      color: "#673AB7",
      size: 38
    },
    variant: "elevated"
  },
  {
    onPress: () => console.log("Card five clicked! Wowee!"),
    longPress: () => console.log("Extra long press on card five detected! So patient!"),
    mainComponent: <View style={{ height: 50, backgroundColor: '#ffcdd2' }} />,
    textContent: {
      title: "Nutrition Tips!",
      subtitle: "Fuel your adventures!",
    },
    iconProps: {
      icon: "food-apple",
      color: "#E91E63",
      size: 44
    },
    variant: "default"
  }
];

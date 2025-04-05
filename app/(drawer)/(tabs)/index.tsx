import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenTransition from "@/components/screenTransition";
import { ScrollView } from 'react-native-gesture-handler';
import { FAIcon, IonIcon } from '@/utils/getIcon';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import PaperCard from '@/components/PaperCard';
import {Avatar, Card, Paragraph, Searchbar, Title} from "react-native-paper";
import { CustomCardList } from '@/components/CardDetails';
import { react_logo } from '@/assets/images';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import DropdownMenu from '@/components/DropdownMenu';
import SearchBarComponent from '@/components/SearchBarComponent';



export default function Index() {
 const [searchQuery, setSearchQuery] = useState('');
    const metrics = {steps:"", calories: "", hydration:"",recovery:""}
    const navigation = useNavigation()

    return (
      <View style={styles.container}>
        <Searchbar
          placeholder={"Search"}
          onChangeText={setSearchQuery}
          value={searchQuery}
          icon={() => <FAIcon name="bars" color="black" />}
          onIconPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
    
        <ScreenTransition type="slide">
          <CustomCardList cards={testCards} horizontal={true} />
        </ScreenTransition>
    
        {/* DropDown Menu */}
        <View style={styles.section}>
          <DropdownMenu onSelect={(option) => console.log("Selected:", option)} />
        </View>
      </View>
    );
    
}
const testCards = [
    {img: react_logo, title: "Lesson 1", description:"Beginner", link:'/(drawer)/(guide)/BeginnerGuide'},
    {img: react_logo, title: "Lesson 2", description:"Intermediate", link: '/(drawer)/(guide)/IntermediateGuide'},
    {img: react_logo, title: "Lesson 3", description:"Advanced", link:'/(drawer)/(guide)/AdvancedGuide'},
    {img: react_logo, title: "Lesson 4", description:"Expert", link:'/(drawer)/(guide)/ExpertGuide'},
]
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
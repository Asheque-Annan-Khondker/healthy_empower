import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, Text, View, ScrollView, TouchableOpacity, Modal, Image } from 'react-native';
import { Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';

import DropdownMenu from '@/components/DropdownMenu';
import SearchBarComponent from '@/components/SearchBarComponent';
import SlidingToggleButton from '@/components/SlidingToggleButton';
import CheckButton from '@/components/CheckButton';
import {ProgressBar} from '@/components/ProgressBar';
import CalendarPicker from '@/components/CalendarPicker';

// Components

import PlaceCard from '@/components/PlaceCard';
import ModalFitnessForm from '@/app/ModalFitnessForm';
import DailyFoodLog from '@/components/DailyFoodLog';
import FoodEntryForm from '@/components/FoodEntryForm';
import CurrencyStreakIndicator from '@/components/CurrencyStreakIndicator';
import { FAIcon } from '@/utils/getIcon';

// Assets
import bannerImg from '@/assets/images/yoga.png';
import yogaStudio from '@/assets/images/yogastudio.png';
import walkingTrack from '@/assets/images/walkingtrack.png';
import gymSession from '@/assets/images/gym.png';

const { height, width } = Dimensions.get('window');

export default function Index() {
const [searchQuery, setSearchQuery] = useState('');
const [currentDate, setCurrentDate] = useState(new Date());
const [isFoodModalVisible, setIsFoodModalVisible] = useState(false);
const navigation = useNavigation();

// Format the date as DD/MM/YYYY
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Navigate to previous day
const goToPreviousDay = () => {
  const newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() - 1);
  setCurrentDate(newDate);
};

// Navigate to next day
const goToNextDay = () => {
  const newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() + 1);
  setCurrentDate(newDate);
};

// Handle Add Food button press
const handleAddFood = () => {
  setIsFoodModalVisible(true);
};

// Handle close food modal
const handleCloseFood = () => {
  setIsFoodModalVisible(false);
};

return (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.mainContainer}>

      {/***********    HEADER    *********
       * copied header code from other main screens */}
      <View style={styles.header}>
        <View style={styles.headerContentContainer}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          >
            <Ionicons name="menu" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Home</Text>
        </View>
      </View>

      {/* Scrollable content area */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search bar ***** I don't think we need this anymore
          * Gonna replace with same header as main screens
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          icon={() => <FAIcon name="bars" color="#B25B28" />}
          onIconPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
        />
        */}
  
        {/* Welcome message with logo */}
        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>Welcome back!</Text>
            <Text style={styles.welcomeSubtitle}>Let's continue your fitness journey</Text>
          </View>
          <Image 
            source={require('@/assets/images/squirrel_flex.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <CurrencyStreakIndicator chestnuts={250} streakDays={5} />
  
        {/* Date header with navigation */}
        <View style={styles.dateHeaderContainer}>
          <TouchableOpacity 
            style={styles.dateNavButton}
            onPress={goToPreviousDay}
            activeOpacity={0.7}
          >
            <FAIcon name="chevron-left" size={20} color="#666" />
          </TouchableOpacity>
          
          <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
          
          <TouchableOpacity 
            style={styles.dateNavButton}
            onPress={goToNextDay}
            activeOpacity={0.7}
          >
            <FAIcon name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        {/* Daily Food Log Section */}
        <DailyFoodLog 
          date={currentDate}
          onAddPress={handleAddFood}
        />

        {/* Cards section */}
        <Text style={styles.cardSectionTitle}>Recommended Workouts</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.cardScroll} 
          contentContainerStyle={styles.cardsContainer}
        >          
          <PlaceCard
            title="Easy Stretch Routine"
            subtext="Home"
            leftBottomText="5 mins"
            tag="Beginner"
            image={bannerImg}
            onPress={() => console.log("Easy Stretch Routine pressed")}
          />
          <PlaceCard
            title="Yoga Studio"
            subtext="21 Uni Rd, Wollongong"
            leftBottomText="30 mins"
            tag="Intermediate"
            image={yogaStudio}
            onPress={() => console.log("Yoga Studio pressed")}
          />
          <PlaceCard
            title="Community Walk Track"
            subtext="Riverside Park"
            leftBottomText="7 km"
            tag="Expert"
            image={walkingTrack}
            onPress={() => console.log("Community Walk Track pressed")}
          />
          <PlaceCard
            title="Intro Gym Session"
            subtext="Start Fitness"
            leftBottomText="20 mins"
            tag="Beginner"
            image={gymSession}
            onPress={() => console.log("Intro Gym Session pressed")}
          />
        </ScrollView>
      </ScrollView>
      
      {/* Modal Fitness Form */}
      <ModalFitnessForm />

      {/* Food Entry Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFoodModalVisible}
        onRequestClose={handleCloseFood}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Food Entry</Text>
              <TouchableOpacity onPress={handleCloseFood}>
                <FAIcon name="times" size={24} color="#3A2A1F" />
              </TouchableOpacity>
            </View>
            
            <FoodEntryForm 
              onSave={(foodEntry) => {
                console.log('Food entry saved:', foodEntry);
                // Here you would typically save the food entry to your database
                // For now, we'll just close the modal
                handleCloseFood();
              }}
              onCancel={handleCloseFood}
            />
          </View>
        </View>
      </Modal>
    </View>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
safeArea: {
  flex: 1,
  backgroundColor: '#FAF7F4',
},
mainContainer: {
  flex: 1,
  position: 'relative', // For positioning the fixed START button
},
scrollContent: {
  paddingHorizontal: 16,
  paddingBottom: 80, // Add padding for the START button
},
searchBar: {
  backgroundColor: '#FFFFFF',
  borderRadius: 24,
  marginVertical: 16,
  elevation: 2,
  shadowColor: '#3A2A1F',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  borderWidth: 1,
  borderColor: 'rgba(214, 141, 84, 0.2)',
},
searchInput: {
  color: '#3A2A1F',
},
welcomeContainer: {
  marginTop: 10,
  marginBottom: 20,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
welcomeTextContainer: {
  flex: 1,
},
welcomeTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#3A2A1F',
  marginBottom: 4,
},
welcomeSubtitle: {
  fontSize: 16,
  color: '#9B8579',
},
logoImage: {
  width: 60,
  height: 60,
  marginLeft: 10,
  borderRadius: 30, // Makes it circular if desired
  backgroundColor: 'rgba(214, 141, 84, 0.1)', // Light background to match your theme
  padding: 5,
},
dropdownContainer: {
  marginBottom: 16,
},
dateHeaderContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginVertical: 15,
  backgroundColor: '#D68D54',
  paddingVertical: 12,
  paddingHorizontal: 10,
  borderRadius: 8,
  alignSelf: 'center', // Center horizontally
  width: '100%', // Full width
},
dateText: {
  fontSize: 16, // Slightly smaller font
  fontWeight: 'bold',
  color: '#FFFFFF',
  textAlign: 'center',
  letterSpacing: 1,
},
dateNavButton: {
  padding: 4, // Smaller padding
  justifyContent: 'center',
  alignItems: 'center',
  width: 30, // Smaller width
  height: 30, // Smaller height
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: 15,
},
foodTrackingContainer: {
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  padding: 16,
  marginTop: 16,
  marginBottom: 20,
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  borderWidth: 1,
  borderColor: 'rgba(214, 141, 84, 0.2)',
},
foodTrackingHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(214, 141, 84, 0.1)',
  paddingBottom: 8,
},
foodTrackingTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#3A2A1F',
},
calorieCount: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#D68D54',
},
macroContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10,
},
macroItem: {
  alignItems: 'center',
  flex: 1,
  backgroundColor: 'rgba(214, 141, 84, 0.05)',
  padding: 10,
  borderRadius: 8,
  marginHorizontal: 4,
},
macroValue: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#3A2A1F',
},
macroLabel: {
  fontSize: 12,
  color: '#9B8579',
  marginTop: 4,
},
// Workout card styles
workoutCardsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  marginBottom: 100, // Space for the START button
},
workoutCard: {
  width: '48%',
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  marginBottom: 16,
  overflow: 'hidden',
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
},
workoutImage: {
  width: '100%',
  height: 100,
  resizeMode: 'cover',
},
tagContainer: {
  position: 'absolute',
  right: 8,
  top: 8,
  backgroundColor: '#FFFFFF',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 10,
},
intermediateTag: {
  backgroundColor: '#FFFFFF',
},
tagText: {
  fontSize: 10,
  fontWeight: 'bold',
  color: '#3A2A1F',
},
workoutCardContent: {
  padding: 10,
},
workoutCardTitle: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#3A2A1F',
  marginBottom: 4,
},
locationContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
},
locationText: {
  fontSize: 12,
  color: '#666',
  marginLeft: 4,
},
workoutCardFooter: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 4,
},
durationText: {
  fontSize: 12,
  color: '#666',
},
readMoreButton: {
  backgroundColor: '#E6EFF9',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 10,
},
readMoreText: {
  fontSize: 10,
  fontWeight: 'bold',
  color: '#4285F4',
},
cardSectionTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#3A2A1F',
  marginBottom: 16,
  marginTop: 20,
},
cardScroll: {
  height: 240, // Reduced height for the card section
},
cardsContainer: {
  paddingLeft: 0, // No left padding since parent already has padding
  paddingRight: 16,
},
startButton: {
  position: 'absolute',
  bottom: 80, // Position well above the nav bar
  left: 16,
  right: 16,
  backgroundColor: '#D68D54',
  paddingVertical: 14,
  borderRadius: 24,
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 3,
  shadowColor: '#B25B28',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
},
startButtonText: {
  color: 'white',
  fontSize: 18, // Slightly larger text
  fontWeight: 'bold',
  letterSpacing: 2, // More letter spacing
},
// Modal styles
modalContainer: {
  flex: 1,
  justifyContent: 'flex-end',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  backgroundColor: 'white',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
  maxHeight: '80%',
},
modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
  paddingBottom: 10,
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(214, 141, 84, 0.2)',
},
modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#3A2A1F',
},
modalText: {
  fontSize: 16,
  color: '#3A2A1F',
  marginBottom: 10,
},
modalItemText: {
  fontSize: 14,
  color: '#9B8579',
  marginLeft: 10,
  marginBottom: 5,
},
saveButton: {
  backgroundColor: '#D68D54',
  paddingVertical: 12,
  borderRadius: 24,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 20,
},
saveButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
header: {
  backgroundColor: '#D68D54',
  paddingTop: 70,
  paddingBottom: 15,
  paddingHorizontal: 16,
  top: height-930 // hardcoded this cos i couldnt figue univeral method
},
headerContentContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
menuButton: {
  width: 44,
  height: 44,
  justifyContent: 'center',
  alignItems: 'center',
},
headerTitle: {
  fontSize: 28, // Larger font size
  fontWeight: 'bold',
  color: '#FFFFFF', // White text
  flex: 1,
  marginLeft: 8,
}
});
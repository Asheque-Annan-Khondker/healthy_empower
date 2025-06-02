import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image,
        Animated, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import {AchievementDBModal} from "@/utils/dbFunctions";
import {Achievement} from "@/utils/table.types";

const { width } = Dimensions.get('window');
const CARD_MARGIN = 12; // Increased for better spacing
const CARD_WIDTH = (width - (CARD_MARGIN * 6)) / 2; // Changed to 2 columns instead of 3

// Sample achievements for fitness app with descriptions and acorn values
// const achievements = [
// {
//   id: 1,
//   title: "First Workout",
//   description: "Complete your first workout",
//   icon: "barbell",
//   category: "fitness",
//   completed: true,
//   xp: 50,
//   date: "May 10, 2025"
// },
// {
//   id: 2,
//   title: "Healthy Meal",
//   description: "Log a balanced meal",
//   icon: "nutrition",
//   category: "nutrition",
//   completed: true,
//   xp: 25,
//   date: "May 11, 2025"
// },
// {
//   id: 3,
//   title: "Weight Goal",
//   description: "Reach your first goal",
//   icon: "body",
//   category: "milestone",
//   completed: true,
//   xp: 100,
//   date: "May 12, 2025"
// },
// {
//   id: 4,
//   title: "7-Day Streak",
//   description: "Exercise for a week",
//   icon: "calendar",
//   category: "consistency",
//   completed: true,
//   xp: 75,
//   date: "May 14, 2025"
// },
// {
//   id: 5,
//   title: "Cardio Master",
//   description: "30 mins continuous",
//   icon: "heart",
//   category: "fitness",
//   completed: false,
//   xp: 80
// },
// {
//   id: 6,
//   title: "Nutrition Plan",
//   description: "Follow plan for 3 days",
//   icon: "restaurant",
//   category: "nutrition",
//   completed: false,
//   xp: 60
// },
// {
//   id: 7,
//   title: "Gym Regular",
//   description: "Visit gym 10 times",
//   icon: "fitness",
//   category: "consistency",
//   completed: false,
//   xp: 90
// },
// {
//   id: 8,
//   title: "Perfect Macros",
//   description: "Hit all macro targets",
//   icon: "pie-chart",
//   category: "nutrition",
//   completed: true,
//   xp: 70,
//   date: "May 15, 2025"
// },
// {
//   id: 9,
//   title: "Group Class",
//   description: "Join a fitness class",
//   icon: "people",
//   category: "fitness",
//   completed: false,
//   xp: 65
// },
// {
//   id: 10,
//   title: "Fitness Test",
//   description: "Complete assessment",
//   icon: "analytics",
//   category: "milestone",
//   completed: false,
//   xp: 120
// },
// {
//   id: 11,
//   title: "Profile Setup",
//   description: "Complete your profile",
//   icon: "person",
//   category: "account",
//   completed: true,
//   xp: 30,
//   date: "May 8, 2025"
// },
// {
//   id: 12,
//   title: "Weekend Workout",
//   description: "Exercise on weekend",
//   icon: "sunny",
//   category: "consistency",
//   completed: false,
//   xp: 45
// },
// ];


// Get icon name based on category
const getIconName = (achievement) => {
if (achievement.icon) {
  return achievement.icon;
}

switch (achievement.category) {
  case 'fitness':
    return 'barbell';
  case 'nutrition':
    return 'restaurant';
  case 'consistency':
    return 'calendar';
  case 'milestone':
    return 'trophy';
  default:
    return 'star';
}
};

// Get gradient colors based on category - Updated with softer, more pleasant colors
const getGradientColors = (achievement) => {
if (!achievement.completed) {
  return ['#454545', '#2D2D2D']; // Softer dark gradient for incomplete
}

switch (achievement.category) {
  case 'fitness':
    return ['#F8A353', '#E97F4E']; // Softer orange gradient
  case 'nutrition':
    return ['#6ABD6E', '#45A048']; // Softer green gradient
  case 'consistency':
    return ['#5EADF5', '#3B92E3']; // Softer blue gradient
  case 'milestone':
    return ['#B470C8', '#9559B6']; // Softer purple gradient
  default:
    return ['#E97F4E', '#D67443']; // Softer default app gradient
}
};

// Get background pattern based on category
const getPatternOpacity = (achievement) => {
if (!achievement.completed) {
  return 0.03; // Very subtle for locked
}
return 0.08; // Reduced opacity for better visual
};

const AchievementWall = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([])
    // Fetch achievements from the database
  useEffect(()=>{
    const loadAchievements = async () =>{
      try {
        const fetchedAchievements = await AchievementDBModal.get()
        console.log("Fetching Achievements")
        setAchievements(fetchedAchievements);
      } catch (err){
        console.error("Error fetching achievements: ", err);
      }
    }
    loadAchievements();
  },[])
// Calculate completion percentage
const completedCount = achievements.filter(a => a.completed).length;
const completionPercentage = (completedCount / achievements.length) * 100;
const totalAcorns = achievements.filter(a => a.completed).reduce((sum, item) => sum + item.xp, 0);
const navigation = useNavigation();

// For achievement details modal
const [selectedAchievement, setSelectedAchievement] = useState(null);
const [detailsVisible, setDetailsVisible] = useState(false);

const showAchievementDetails = (achievement) => {
  setSelectedAchievement(achievement);
  setDetailsVisible(true);
};

const closeDetails = () => {
  setDetailsVisible(false);
};

return (
  <SafeAreaView style={[styles.container, styles.AndroidSafeArea]}>
    {/* Updated header to match shop header style */}
    <View style={styles.header}>
      <View style={styles.headerContentContainer}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        >
          <Ionicons name="menu" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>{totalAcorns} 🌰</Text>
        </View>
      </View>
    </View>
    
    {/* Original content below - with background color adjusted to not look like part of the header */}
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{completedCount}</Text>
        <Text style={styles.statLabel}>Completed</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBar, { width: `${completionPercentage}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.round(completionPercentage)}%</Text>
      </View>
      
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{achievements.length}</Text>
        <Text style={styles.statLabel}>Total</Text>
      </View>
    </View>
    
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Achievement grid - now 2 columns instead of 3 */}
      <View style={styles.achievementGrid}>
        {achievements.map((achievement) => (
          <TouchableOpacity 
            key={achievement.id} 
            style={styles.achievementItem}
            activeOpacity={0.75}
            onPress={() => showAchievementDetails(achievement)}
          >
            <View style={styles.achievementCardContainer}>
              <LinearGradient
                colors={getGradientColors(achievement)}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.achievementCard}
              >
                {/* Pattern overlay */}
                <View style={[
                  styles.patternOverlay, 
                  { opacity: getPatternOpacity(achievement) }
                ]} />
                
                {/* Icon */}
                <View style={styles.iconContainer}>
                  <Ionicons 
                    name={getIconName(achievement)} 
                    size={28} 
                    color="#FFFFFF" 
                  />
                </View>
                
                {/* Text content */}
                <View style={styles.textContainer}>
                  <Text style={styles.achievementTitle} numberOfLines={1}>
                    {achievement.title}
                  </Text>
                  
                  <Text style={styles.achievementDescription} numberOfLines={1}>
                    {achievement.description}
                  </Text>
                </View>
                
                {/* Acorn indicator */}
                <View style={styles.acornBadge}>
                  <Text style={styles.acornBadgeText}>{achievement.xp} <Text style={styles.acornEmoji}>🌰</Text></Text>
                </View>
                
                {/* Lock overlay for incomplete */}
                {!achievement.completed && (
                  <BlurView intensity={15} style={styles.lockedOverlay}>
                    <View style={styles.lockIconContainer}>
                      <Ionicons name="lock-closed" size={22} color="#FFFFFF" />
                    </View>
                  </BlurView>
                )}
              </LinearGradient>
              
              {/* Drop shadow for card */}
              <View style={styles.cardShadow} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
    
    {/* Achievement details modal */}
    {selectedAchievement && (
      <Animated.View 
        style={[
          styles.detailsModal,
          { display: detailsVisible ? 'flex' : 'none' }
        ]}
      >
        <BlurView intensity={40} style={styles.blurOverlay}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={closeDetails}
          >
            <Ionicons name="close-circle" size={32} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.detailsCard}>
            <LinearGradient
              colors={getGradientColors(selectedAchievement)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.detailsCardGradient}
            >
              <View style={styles.detailsIconContainer}>
                <Ionicons 
                  name={getIconName(selectedAchievement)} 
                  size={48} 
                  color="#FFFFFF" 
                />
              </View>
              
              <Text style={styles.detailsTitle}>
                {selectedAchievement.title}
              </Text>
              
              <Text style={styles.detailsDescription}>
                {selectedAchievement.description}
              </Text>
              
              {selectedAchievement.completed ? (
                <View style={styles.completedInfo}>
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.completedInfoText}>
                    Completed on {selectedAchievement.date}
                  </Text>
                </View>
              ) : (
                <View style={styles.lockedInfo}>
                  <Ionicons name="lock-closed" size={20} color="#FFFFFF" />
                  <Text style={styles.lockedInfoText}>
                    Complete the task to unlock
                  </Text>
                </View>
              )}
              
              <View style={styles.detailsAcornContainer}>
                <Text style={styles.acornEmoji}>🌰</Text>
                <Text style={styles.detailsAcornText}>
                  {selectedAchievement.xp} Acorns
                </Text>
              </View>
            </LinearGradient>
          </View>
        </BlurView>
      </Animated.View>
    )}
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#F8F8F8', // Slightly warmer background
},
// bascially SafeAreaView for android
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
// New header styles to match shop header
header: {
  backgroundColor: '#D68D54',
  height: 90,
  paddingTop: 20,
  paddingBottom: 15,
  paddingHorizontal: 16,
  justifyContent: 'flex-end',
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
  fontSize: 28,
  fontWeight: 'bold',
  color: '#FFFFFF',
  flex: 1,
  marginLeft: 8,
},
balanceContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 20,
},
balanceText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#FFFFFF',
},
// Stats section - updated to clearly separate from header
statsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  padding: 16,
  margin: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
statItem: {
  alignItems: 'center',
},
statValue: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#3A2A1F',
},
statLabel: {
  fontSize: 12,
  color: '#9B8579',
  marginTop: 4,
},
progressContainer: {
  alignItems: 'center',
  flex: 1,
  marginHorizontal: 16,
},
progressBarBackground: {
  height: 8,
  width: '100%',
  backgroundColor: 'rgba(214, 141, 84, 0.2)',
  borderRadius: 4,
  overflow: 'hidden',
  marginBottom: 4,
},
progressBar: {
  height: '100%',
  backgroundColor: '#D68D54',
},
progressText: {
  fontSize: 12,
  color: '#9B8579',
},
scrollView: {
  flex: 1,
},
contentContainer: {
  padding: 16,
  paddingTop: 24,
  paddingBottom: 32,
},
achievementGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
},
achievementItem: {
  width: CARD_WIDTH,
  marginBottom: 20,
  height: 140,
  marginHorizontal: CARD_MARGIN / 2, // Adjusted for better spacing
},
achievementCardContainer: {
  flex: 1,
  position: 'relative',
},
achievementCard: {
  flex: 1,
  borderRadius: 18, // Slightly larger radius
  padding: 14, // Slightly more padding
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  zIndex: 1,
},
patternOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: '#FFFFFF',
  opacity: 0.08, // Lower opacity
  zIndex: -1,
},
cardShadow: {
  position: 'absolute',
  top: 4,
  left: 0,
  right: 0,
  bottom: -4,
  backgroundColor: 'rgba(0, 0, 0, 0.2)', // Softer shadow
  borderRadius: 18,
  zIndex: -1,
},
iconContainer: {
  width: 56, // Slightly larger
  height: 56, // Slightly larger
  borderRadius: 28,
  backgroundColor: 'rgba(255, 255, 255, 0.25)', // Lighter background
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 8,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.3)',
},
textContainer: {
  alignItems: 'center',
  width: '100%',
},
achievementTitle: {
  fontSize: 15, // Slightly larger
  fontWeight: 'bold',
  color: '#FFFFFF',
  textAlign: 'center',
  textShadowColor: 'rgba(0, 0, 0, 0.2)', // Reduced shadow
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 1,
},
achievementDescription: {
  fontSize: 12, // Slightly larger
  color: 'rgba(255, 255, 255, 0.95)', // Increased contrast
  textAlign: 'center',
  marginTop: 3,
},
acornBadge: {
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(0, 0, 0, 0.15)', // Lighter background
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 10,
},
acornBadgeText: {
  color: '#FFFFFF', // Changed from green to white for better visibility
  fontSize: 10,
  fontWeight: 'bold',
},
acornEmoji: {
  // Added to handle the acorn emoji styling
},
lockedOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 18,
},
lockIconContainer: {
  width: 44, // Slightly larger
  height: 44, // Slightly larger
  borderRadius: 22,
  backgroundColor: 'rgba(0, 0, 0, 0.35)', // Softer background
  justifyContent: 'center',
  alignItems: 'center',
},
detailsModal: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
},
blurOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
},
closeButton: {
  position: 'absolute',
  top: 40,
  right: 20,
  zIndex: 1001,
},
detailsCard: {
  width: '80%',
  aspectRatio: 0.7,
  borderRadius: 24, // Larger radius
  overflow: 'hidden',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.25, // Reduced shadow
  shadowRadius: 10,
  elevation: 10,
},
detailsCardGradient: {
  flex: 1,
  padding: 24,
  alignItems: 'center',
  justifyContent: 'center',
},
detailsIconContainer: {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: 'rgba(255, 255, 255, 0.25)', // Lighter background
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 20,
  borderWidth: 2,
  borderColor: 'rgba(255, 255, 255, 0.3)',
},
detailsTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#FFFFFF',
  textAlign: 'center',
  marginBottom: 8,
  textShadowColor: 'rgba(0, 0, 0, 0.2)', // Reduced shadow
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 2,
},
detailsDescription: {
  fontSize: 16,
  color: '#FFFFFF',
  textAlign: 'center',
  marginBottom: 24,
},
completedInfo: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.2)', // Lighter background
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 12,
  marginBottom: 16,
},
completedInfoText: {
  color: '#FFFFFF',
  marginLeft: 8,
},
lockedInfo: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 12,
  marginBottom: 16,
},
lockedInfoText: {
  color: '#FFFFFF',
  marginLeft: 8,
},
detailsAcornContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 16,
},
detailsAcornText: {
  color: '#FFFFFF',
  fontSize: 20,
  fontWeight: 'bold',
  marginLeft: 8,
},
});

export default AchievementWall;
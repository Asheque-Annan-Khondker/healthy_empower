// app/(drawer)/_layout.tsx
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { router, useNavigation } from "expo-router";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { logout, getCurrentUser } from "@/components/utils/authUtils";
import React, { useState, useEffect } from 'react';

// Custom drawer item component
const DrawerItem = ({ icon, label, onPress, active = false }) => (
  <TouchableOpacity 
    style={[styles.drawerItem, active && styles.drawerItemActive]} 
    onPress={onPress}
  >
    {icon}
    <Text style={[styles.drawerItemText, active && styles.drawerItemTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// Custom drawer content component
const CustomDrawerContent = (props) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState('/');

  // Helper for getting icon color based on active state
  const getIconColor = (route) => activeItem === route ? '#D68D54' : '#3A2A1F';

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const user = await getCurrentUser();
        setUserData(user);
      } catch (error) {
        console.error("Error loading user data", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleNavigation = (route) => {
    setActiveItem(route);
    router.navigate(route);
    props.navigation.closeDrawer();
  };

  return (
    <View style={styles.container}>
      {/* Header with profile section */}
      <LinearGradient
        colors={['#D68D54', '#B25B28']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={require('@/assets/images/squirrel_flex.png')}
            style={styles.avatar}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.username}>{userData?.username || 'user'}</Text>
        <Text style={styles.email}>{userData?.email || 'user@example.com'}</Text>
      </LinearGradient>

      {/************** Drawer items **************/}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
      >
        {/*************************** Main navigation section ***************************/}
        <DrawerItem
          icon={<Ionicons name="home-outline" size={22} color={getIconColor('/')} />}
          label="Home"
          onPress={() => handleNavigation('/')}
          active={activeItem === '/'}
        />
        <DrawerItem
          icon={<FontAwesome5 name="trophy" size={20} color={getIconColor('/(drawer)/leaderboard')} />}
          label="Leaderboard"
          onPress={() => handleNavigation('/(drawer)/leaderboard')}
          active={activeItem === '/(drawer)/leaderboard'}
        />
        <DrawerItem
          icon={<Ionicons name="settings-outline" size={22} color={getIconColor('/(drawer)/settings')} />}
          label="Settings"
          onPress={() => handleNavigation('/(drawer)/settings')}
          active={activeItem === '/(drawer)/settings'}
        />
        <DrawerItem
          icon={<Ionicons name="bug-outline" size={22} color={getIconColor('/(drawer)/debugScreen')} />}
          label="Debug"
          onPress={() => handleNavigation('/(drawer)/debugScreen')}
          active={activeItem === '/(drawer)/debugScreen'}
        />

        {/************************** Start-Up Guides section ***********************************************************/}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Start-Up Guides</Text>
          <View style={styles.divider} />
        </View>

        <DrawerItem
          icon={<FontAwesome5 name="baby" size={18} color={getIconColor('/(drawer)/(guide)/BeginnerGuide')} />}
          label="Beginner"
          onPress={() => handleNavigation('/(drawer)/(guide)/BeginnerGuide')}
          active={activeItem === '/(drawer)/(guide)/BeginnerGuide'}
        />
        <DrawerItem
          icon={<FontAwesome5 name="walking" size={18} color={getIconColor('/(drawer)/(guide)/IntermediateGuide')} />}
          label="Intermediate"
          onPress={() => handleNavigation('/(drawer)/(guide)/IntermediateGuide')}
          active={activeItem === '/(drawer)/(guide)/IntermediateGuide'}
        />
        <DrawerItem
          icon={<FontAwesome5 name="running" size={18} color={getIconColor('/(drawer)/(guide)/ExpertGuide')} />}
          label="Expert"
          onPress={() => handleNavigation('/(drawer)/(guide)/ExpertGuide')}
          active={activeItem === '/(drawer)/(guide)/ExpertGuide'}
        />

        {/**********************************  Fitness Guides section **********************************/}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Fitness Guides</Text>
          <View style={styles.divider} />
        </View>

        <DrawerItem
          icon={<Ionicons name="list-outline" size={22} color={getIconColor('/(drawer)/(guide)/guideSelection')} />}
          label="Guide Selection"
          onPress={() => handleNavigation('/(drawer)/(guide)/guideSelection')}
          active={activeItem === '/(drawer)/(guide)/guideSelection'}
        />

        {/* 
        <DrawerItem
          icon={<Ionicons name="list-outline" size={22} color={getIconColor('/(drawer)/ProfileSettings')} />}
          label="Profile Settings Screen"
          onPress={() => handleNavigation('/(drawer)/ProfileSettings')}
          active={activeItem === '/(drawer)/ProfileSettings'}
        />
        */}
      
      </DrawerContentScrollView>

      {/* Logout button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => logout()}
      >
        <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

// Custom header component with gradient
const CustomHeader = ({ title, navigation, route }) => {
  // Check if we're on the home screen
  const isHomeScreen = route?.name === "(tabs)";
  
  // Don't render header for home screen
  if (isHomeScreen) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#D68D54', '#B25B28']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={headerStyles.headerContainer}
    >
      <View style={headerStyles.headerContent}>
        {/* Always use sandwich menu button regardless of navigation state */}
        <TouchableOpacity
          style={headerStyles.menuButton}
          onPress={() => navigation.toggleDrawer()}
        >
          <Ionicons name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={headerStyles.headerTitle}>{title}</Text>
      </View>
    </LinearGradient>
  );
};

// Main drawer layout
export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation, route }) => ({
        drawerStyle: {
          width: '75%',
          backgroundColor: '#FAF7F4',
        },
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        swipeEdgeWidth: 50,
        header: ({ navigation, route, options }) => {
          // Get the title from the route name or options
          let title = options.title || '';
          
          // If no title is provided, format the route name
          if (!title) {
            // Extract the last part of the route name (after the last /)
            const routeParts = route.name.split('/');
            const lastPart = routeParts[routeParts.length - 1];
            
            // Convert from camelCase or snake_case and capitalize first letter
            title = lastPart
              .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
              .replace(/_/g, ' ') // Replace underscores with spaces
              .replace(/^\w/, c => c.toUpperCase()); // Capitalize first letter
          }
          
          return <CustomHeader title={title} navigation={navigation} route={route} />;
        },
        // Hide the header completely for Home screen ((tabs) route)
        //headerShown: route.name !== "(tabs)",
      })}
    >
      <Drawer.Screen 
        name="(tabs)" 
        options={{ 
          title: 'Home',
          //headerShown: false, // Explicitly hide header for home screen
        }}
      />
      <Drawer.Screen 
        name="leaderboard" 
        options={{ 
          title: "Leaderboard",
        }} 
      />
      <Drawer.Screen 
        name="settings" 
        options={{ 
          title: "Settings",
        }} 
      />
      <Drawer.Screen 
        name="debugScreen" 
        options={{ 
          title: "Debug",
        }} 
      />
      <Drawer.Screen 
        name="(guide)/BeginnerGuide" 
        options={{ 
          title: 'Beginner Guide',
        }} 
      />
      <Drawer.Screen 
        name="(guide)/IntermediateGuide" 
        options={{ 
          title: 'Intermediate Guide',
        }} 
      />
      <Drawer.Screen 
        name="(guide)/guideSelection" 
        options={{ 
          title: 'Guide Selection',
        }} 
      />
      <Drawer.Screen 
        name="(guide)/ExpertGuide" 
        options={{ 
          title: 'Expert Guide',
        }} 
      />
      <Drawer.Screen 
        name="ProfileSettings" 
        options={{ 
          title: 'Profile Settings',
          headerShown: false,
          drawerItemStyle: {display: 'none'}
        }} 
      />
    
    </Drawer>
  );
}

// Header styles
const headerStyles = StyleSheet.create({
  headerContainer: {
    height: 90,
    paddingTop: 40, // Adjust for status bar
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

// Drawer styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F4',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  avatar: {
    width: 50,
    height: 50,
  },
  username: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 2,
  },
  drawerItemActive: {
    backgroundColor: 'rgba(214, 141, 84, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#D68D54',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#3A2A1F',
    marginLeft: 24,
  },
  drawerItemTextActive: {
    color: '#D68D54',
    fontWeight: '600',
  },
  sectionContainer: {
    marginTop: 15,
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(214, 141, 84, 0.2)',
    marginBottom: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D68D54',
    padding: 12,
    margin: 20,
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
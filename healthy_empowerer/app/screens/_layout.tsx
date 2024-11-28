import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

function StatusBarPlaceholder() {
  return (
    <View style={styles.statusBar}>
      <Text style={styles.statusBarText}>9:30</Text>
      <View style={styles.statusBarCenterDot} />
      <View style={styles.statusBarIconsContainer}>
        <Ionicons name="wifi" size={14} color="black" />
        <Ionicons name="battery-full" size={14} color="black" style={styles.batteryIcon} />
      </View>
    </View>
  );
}

function Header() {
  return (
    <View style={styles.headerContainer}>
      <MaterialIcons name="menu" size={24} color="black" style={styles.menuIcon} />
      <Text style={styles.headerText}>Hi, Syed</Text>
      <Ionicons name="person-circle-outline" size={24} color="black" style={styles.headerIcon} />
    </View>
  );
}

function GuidesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBarPlaceholder />
      <Header />
      <View style={styles.dividerContainer}>
        <View style={styles.runningLineContainer}>
          <View style={styles.runningLineProgress} />
          <View style={styles.runningLineRemaining} />
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBarPlaceholder />
      <Header />
      <View style={styles.dividerContainer}>
        <View style={styles.runningLineContainer}>
          <View style={styles.runningLineProgress} />
          <View style={styles.runningLineRemaining} />
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

function StatsScreen() {
  return (
    <View style={styles.container}>
      <StatusBarPlaceholder />
      <Header />
      <View style={styles.dividerContainer}>
        <View style={styles.runningLineContainer}>
          <View style={styles.runningLineProgress} />
          <View style={styles.runningLineRemaining} />
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function GuidesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Guides" component={GuidesScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <ExpoStatusBar style="dark" />
      <StatusBar barStyle="dark-content" backgroundColor="#f8f5fa" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Guides') {
              iconName = focused ? 'star' : 'star-outline';
            } else if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Stats') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#b09cd8',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { height: 100, paddingBottom: 10, backgroundColor: '#f8f5fa' },
          tabBarLabelStyle: { fontSize: 12, marginTop: 0 },
          tabBarIconStyle: { marginTop: 10 },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Guides" component={GuidesStack} />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
      </Tab.Navigator>
      <View style={styles.homeIndicatorWrapper}>
        <View style={styles.homeIndicator} />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  statusBar: {
    width: '100%',
    height: Constants.statusBarHeight + 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? Constants.statusBarHeight : 5,
  },
  statusBarText: {
    fontSize: 14,
  },
  statusBarCenterDot: {
    width: 18,
    height: 18,
    backgroundColor: 'black',
    borderRadius: 10,
  },
  statusBarIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryIcon: {
    marginLeft: 5,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
    paddingHorizontal: 20,
    backgroundColor: '#f8f5fa',
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
  },
  menuIcon: {
    marginLeft: 10,
  },
  headerText: {
    fontSize: 18,
    marginLeft: 10,
    flex: 1,
  },
  headerIcon: {
    marginRight: 10,
  },
  dividerContainer: {
    backgroundColor: '#f4f4f4',
    paddingVertical: 15,
  },  
  runningLineContainer: {
    flexDirection: 'row',
    height: 3,
    marginHorizontal: 20,
  },
  runningLineprogress: {
    flex: 1,
    backgroundColor: '#8465c2',
  },
  runningLineRemaining: {
    flex: 2,
    backgroundColor: '#e0e0e0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 15,
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  homeIndicatorWrapper: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: 'black',
    borderRadius: 2.5,
  },
});

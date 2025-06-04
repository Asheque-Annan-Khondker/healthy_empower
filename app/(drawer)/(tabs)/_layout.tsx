import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Custom header component for tab screens to match drawer style
const TabHeader = ({ title, navigation }: { title: string, navigation: any }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
      <View style={styles.headerContentContainer}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        >
          <Ionicons name="menu" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: true,
      header: ({ navigation, route, options }) => (
        <TabHeader title={options.title || 'Home'} navigation={navigation} />
      )
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }}
      />
      
      <Tabs.Screen
        name="shop_screen"
        options={{
          title: 'Shop',
          tabBarLabel: 'Shop',
          tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} />
        }}
      />
      
      <Tabs.Screen
        name="diet_screen"
        options={{
          title: 'Diet',
          tabBarLabel: 'Diet',
          tabBarIcon: ({ color }) => <Ionicons name="nutrition" size={24} color={color} />
        }}
      />
      
      <Tabs.Screen
        name="achievement_screen"
        options={{
          title: 'Achievements',
          tabBarLabel: 'Achievements',
          tabBarIcon: ({ color }) => <Ionicons name="trophy" size={24} color={color} />
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#D68D54',
    // paddingTop is now dynamic based on safe area insets
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  headerContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
});
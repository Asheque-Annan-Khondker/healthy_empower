import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function TabLayout() {
  // Super simple version with achievement tab added
  return (
    <Tabs screenOptions={{ headerShown: false }}>
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
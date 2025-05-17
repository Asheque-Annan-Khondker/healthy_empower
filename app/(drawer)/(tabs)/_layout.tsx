import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import React from "react";

import Index from ".";
import DietScreen from "./diet_screen";
import AchievementScreen from "./achievement_screen";
import {FAIcon, MatIcon} from "@/utils/getIcon";
import {View} from "react-native";
import {Appbar} from "react-native-paper";
import {DrawerToggleButton} from "@react-navigation/drawer";
import {Tabs, useNavigation} from "expo-router";
import {DrawerActions} from "@react-navigation/native";

export default function TabLayout() {
  // Super simple version to test if it works
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Home',
          tabBarLabel: 'Home'
        }}
      />
    </Tabs>
  );
}


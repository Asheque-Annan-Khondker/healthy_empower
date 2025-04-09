import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import React from "react";

import Index from ".";
import DietScreen from "./diet_screen";
import AchievementScreen from "./achievement_screen";
import {FAIcon, MatIcon} from "@/utils/getIcon";
import {View} from "react-native";
import {Appbar} from "react-native-paper";
import {DrawerToggleButton} from "@react-navigation/drawer";
import {useNavigation} from "expo-router";
import {DrawerActions} from "@react-navigation/native";
export default function tablayout() {
  const tabs = createMaterialBottomTabNavigator()
    const navigation = useNavigation()
  return (
      // * having flex, the entire screen isnt consumed by the appbar
      <View style={{flex: 1}}>
          <Appbar.Header>
              <Appbar.Action icon={"arrow-left"} onPress={()=>{navigation.dispatch(DrawerActions.toggleDrawer())}} />
          </Appbar.Header>
    <tabs.Navigator style={{flex: 1}}>

      <tabs.Screen
        name="diet_screen"
        component={DietScreen}
        options={{
          title: 'diet',
          tabBarIcon: ({ color }) => <FAIcon size={28} name="square" color={color} />,
        }}
      />

        <tabs.Screen
            name="index"
            component={Index}
            options={{
                title: 'home',
                tabBarIcon: ({ color }) => <FAIcon size={28} name="home" color={color} />,
            }}
        />
        <tabs.Screen
            name={"achievement_screen"}
            component={AchievementScreen}
            options={{
                title: 'achievements',
                tabBarIcon: ({ color }) => <FAIcon size={28} name="trophy" color={color} />,
            }}
        />
    </tabs.Navigator>
      </View>
  );
}


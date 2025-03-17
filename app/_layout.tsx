// This should be the entire app container. Thhe profile header should be called here.
// )layout files are for persistent compoenents for the current and child screens.
import { Stack } from 'expo-router/stack';
import { GestureHandlerRootView} from 'react-native-gesture-handler'
import {Drawer} from "expo-router/drawer";
import {createNativeStackNavigator} from "react-native-screens/native-stack";
import {createDrawerNavigator} from "@react-navigation/drawer";
import React from 'react';
import { Provider as PaperProvider } from "react-native-paper";

export default function Layout() {
  return (
  <PaperProvider>
      <GestureHandlerRootView>
        <Stack screenOptions={{headerShown: false}}>
          {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
            <Stack.Screen name="(drawer)" options={{ headerShown:false}} />
        </Stack>
      </GestureHandlerRootView>
  </PaperProvider>
  );
}
// const StackNav = createNativeStackNavigator()
// const DrawNav = createDrawerNavigator()

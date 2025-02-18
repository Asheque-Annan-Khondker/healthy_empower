// This should be the entire app container. Thhe profile header should be called here.
// )layout files are for persistent compoenents for the current and child screens.
import { Stack } from 'expo-router/stack';
import { GestureHandlerRootView} from 'react-native-gesture-handler'
import {Drawer} from "expo-router/drawer";
import {createNativeStackNavigator} from "react-native-screens/native-stack";
import {createDrawerNavigator} from "@react-navigation/drawer";

export default function Layout() {
  return (

    <GestureHandlerRootView>
      <Stack screenOptions={{headerShown: false}}>
        {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
          {/* <Stack.Screen name="(Drawer)" options={{ headerShown:false}} /> */}
      </Stack>
    </GestureHandlerRootView>
  );
}
// const StackNav = createNativeStackNavigator()
// const DrawNav = createDrawerNavigator()

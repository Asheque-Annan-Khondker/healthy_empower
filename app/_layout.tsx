// This should be the entire app container. Thhe profile header should be called here.
// )layout files are for persistent compoenents for the current and child screens.
import { Stack } from 'expo-router/stack';
import {useMaterial3Theme} from '@pchmn/expo-material3-theme'
import { GestureHandlerRootView} from 'react-native-gesture-handler'
import {Drawer} from "expo-router/drawer";
import {createNativeStackNavigator} from "react-native-screens/native-stack";
import {createDrawerNavigator} from "@react-navigation/drawer";
import React from 'react';
import { DefaultTheme, MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import {useColorScheme, StyleSheet, View, Dimensions} from 'react-native';
import {StatusBar} from "expo-status-bar";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import { initializeDatabase } from '@/utils/database';

const theme = {
  ...DefaultTheme,
  colors: {
    primary: 'tomato',
    secondary: 'pink',

  },
  animation:{scale: 3}
}

export default function Layout() {
  initializeDatabase()
  const colorScheme = useColorScheme()
  const {theme} = useMaterial3Theme()
  const globalTheme = useColorScheme()
  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
      colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  const papaTheme = colorScheme =="dark" ? {...MD3DarkTheme, colors:theme.dark} : {...MD3LightTheme, colors: theme.light}

  return (

    <GestureHandlerRootView>
      <PaperProvider theme={papaTheme} >

      <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="(drawer)" options={{ headerShown:false}} />
      </Stack>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
// const StackNav = createNativeStackNavigator()
// const DrawNav = createDrawerNavigator()

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
  },
  lightContainer: {
    backgroundColor: '#d0d0c0',
  },
  darkContainer: {
    backgroundColor: '#242c40',
  },
  lightThemeText: {
    color: '#242c40',
  },
  darkThemeText: {
    color: '#d0d0c0',
  },
});

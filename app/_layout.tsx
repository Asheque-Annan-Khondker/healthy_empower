import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider, Portal, Provider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WorkoutProvider } from '../Context/WorkoutContext';
import { APIConfiguration } from '@/constants/DBAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppLayout() {
  const [apiReady, setApiReady] = React.useState(false);
  const [discStatus, setDiscStatus] = React.useState('Init...');

  useEffect(()=>{
    const initAPI = async() =>{
      try{
        setDiscStatus('Initializing API...');
        const url =  await APIConfiguration.init();
        setDiscStatus(`API Initialized: ${url}`);
        
      } catch (error) {
        console.error('Error initializing API:', error);
        setDiscStatus('Using Fallback URL');

      }
    }
    initAPI()
  }, [])

  
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider>
          <WorkoutProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="signin" options={{ headerShown: false }} />
              <Stack.Screen name="signup" options={{ headerShown: false }} />
              <Stack.Screen name="guideContent" options={{ headerShown: false }} />
            </Stack>
          </WorkoutProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

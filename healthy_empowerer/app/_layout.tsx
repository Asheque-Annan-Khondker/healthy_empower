import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{
  headerStyle: {
    backgroundColor: 'black'
  },
  headerTintColor: '#fff',
  headerTitleStyle:{
    fontWeight: 'bold'
  }}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="home_screen" /> 
    </Stack>
  );
}


const styles = [


]

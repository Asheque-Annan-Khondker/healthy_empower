import {Drawer} from "expo-router/drawer";
import {DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import { router } from "expo-router";


const CustomDrawerContent = (props) => {
   return( <DrawerContentScrollView {...props} >
    {/* This is for the drawer that shows up when a tab screen is displayed */}
        <DrawerItem label={"Setting"} onPress={()=>{router.navigate("/(drawer)/settings")}} />
        <DrawerItem label={"debug"} onPress={()=>{router.navigate("/(drawer)/debugScreen")}} />
        <DrawerItem label={"Beginner"} onPress={()=>{router.navigate("/(drawer)/(guide)/BeginnerGuide")}} />
        <DrawerItem label={"Intermediate"} onPress={()=>{router.navigate("/(drawer)/guide/IntermediateGuide")}} />
        <DrawerItem label={"Advanced"} onPress={()=>{router.navigate("/(drawer)/guide/AdvancedGuide")}} />
        <DrawerItem label={"Expert"} onPress={()=>{router.navigate("/(drawer)/guide/ExpertGuide")}} />
    </DrawerContentScrollView>
   )
}
// Introduce (tabs) into the same stack
export default function DrawerEntry(){
    return (
    <Drawer drawerContent ={(props)=><CustomDrawerContent {...props}/>}screenOptions={{headerShown: false}}>
    <Drawer.Screen name={"settings"} options={{headerShown: true}} />
    <Drawer.Screen name={"debugScreen"} options={{headerShown: true}} />
    <Drawer.Screen name={"(guide)/BeginnerGuide"} options={{headerShown: true, title: 'Beginner Guide'}} />
  
    </Drawer>
  )
}

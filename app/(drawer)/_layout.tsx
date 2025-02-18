import {Drawer} from "expo-router/drawer";
import {DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import { router } from "expo-router";

const CustomDrawerContent = (props) => {
   return( <DrawerContentScrollView {...props} >
    {/* This is for the drawer that shows up when a tab screen is displayed */}
        <DrawerItem label={"Test"} onPress={()=>{router.navigate("/(drawer)/test")}} />
    </DrawerContentScrollView>
   )
}

export default function DrawerEntry(){
    return (
    <Drawer drawerContent ={(props)=><CustomDrawerContent {...props}/>}screenOptions={{headerShown: false}}>
    <Drawer.Screen name={"test"} options={{headerShown: true}} />
    </Drawer>
  )
}

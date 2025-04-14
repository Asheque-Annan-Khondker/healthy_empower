import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import {router, useNavigation} from "expo-router";
import { View, Image, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { react_logo } from "@/assets/images";
import { logout, getCurrentUser } from "@/components/utils/authUtils";
import React, { useState, useEffect } from 'react'; 



const CustomDrawerContent = (props) => {
   const [userData, setUserData] = useState(null); 
   const [loading, setLoading] = useState(true); 
   
    useEffect(() => {
      const loadUserData = async () => {
        setLoading(true);
        const user = await getCurrentUser(); 
        setUserData(user); 
        setLoading(false); 
      };

      loadUserData();
    }, []);

   return( <DrawerContentScrollView {...props}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image 
          source={react_logo} 
          style={styles.profileImage} 
        />
        <>
          <Text style={styles.profileName}>{userData?.username || 'user'}</Text>
          <Text style={styles.profileEmail}>{userData?.email || 'user@example.com'}</Text>
        </>
      </View>
    <DrawerItem 
        label="Home" 
        onPress={() => { router.navigate("/") }} 
        icon={({color, size}) => <MaterialCommunityIcons name="home" size={size} color={color} />}
      />
      <DrawerItem 
        label="Settings" 
        onPress={() => { router.navigate("/(drawer)/settings") }} 
        icon={({color, size}) => <MaterialCommunityIcons name="cog" size={size} color={color} />}
      />
      <DrawerItem 
        label="Debug" 
        onPress={() => { router.navigate("/(drawer)/debugScreen") }} 
        icon={({color, size}) => <MaterialCommunityIcons name="bug" size={size} color={color} />}
      />
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Fitness Guides</Text>
      </View>
      
      <DrawerItem 
        label="Beginner" 
        onPress={() => { router.navigate("/(drawer)/(guide)/BeginnerGuide") }} 
        icon={({color, size}) => <FontAwesome5 name="baby" size={size} color={color} />}
      />
      <DrawerItem 
        label="Intermediate" 
        onPress={() => { router.navigate("/(drawer)/(guide)/IntermediateGuide") }} 
        icon={({color, size}) => <FontAwesome5 name="walking" size={size} color={color} />}
      />
      <DrawerItem 
        label="Expert" 
        onPress={() => { router.navigate("/(drawer)/(guide)/ExpertGuide") }} 
        icon={({color, size}) => <FontAwesome5 name="running" size={size} color={color} />}
      />

      <DrawerItem 
        label="Logout"
        onPress={() => logout()
        }
      />


    </DrawerContentScrollView>
   )
}
// Introduce (tabs) into the same stack
export default function DrawerEntry(){
    const navigation = useNavigation()
    return (
    <Drawer drawerContent ={(props)=><CustomDrawerContent {...props}/>}screenOptions={{headerShown: false}}>
    <Drawer.Screen name={"settings"} options={{headerShown: true}} />
    <Drawer.Screen name={"debugScreen"} options={{headerShown: true}} />
    <Drawer.Screen name={"(guide)/BeginnerGuide"} options={{headerShown: true, title: 'Start-Up Guide'}} />
    <Drawer.Screen name={"(guide)/IntermediateGuide"} options={{headerShown: true, title: 'Start-Up Guide'}} />
    <Drawer.Screen name={"(guide)/ExpertGuide"} options={{headerShown: true, title: 'Start-Up Guide'}} />
  
    </Drawer>
  )
}

const styles = StyleSheet.create({
  profileSection: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4',
    marginBottom: 10
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  profileEmail: {
    fontSize: 14,
    color: '#888'
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666'
  }
});
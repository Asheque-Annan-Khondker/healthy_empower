import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import ScreenTransition from "@/components/screenTransition";
import GuideCardList from '@/components/CardDetails';
import { SafeAreaView } from "react-native";
import { react_logo } from '@/assets/images';
import { FAIcon } from '@/utils/getIcon';
import SearchBarComponent from '@/components/SearchBarComponent';
import DropdownMenu from '@/components/DropdownMenu';


export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar Section */}
      <View style={styles.section}>
        <SearchBarComponent onSearch={setSearchQuery} />
      </View>

      {/*DropDown Menu*/}
      <View style={styles.section}>
        <DropdownMenu onSelect={(option) => console.log("Selected:", option)} />
      </View>

      {/* Guide Cards Section */}
      <ScreenTransition type='slide'>
        <GuideCardList cards={testCards} horizontal={true} />
      </ScreenTransition>
    </SafeAreaView>
  );
}

const testCards = [
  { img: react_logo, title: "Lesson 1", description: "Beginner", link: '/(drawer)/(guide)/BeginnerGuide' },
  { img: react_logo, title: "Lesson 2", description: "Intermediate", link: '/(drawer)/(guide)/IntermediateGuide' },
  { img: react_logo, title: "Lesson 3", description: "Advanced", link: '/(drawer)/(guide)/AdvancedGuide' },
  { img: react_logo, title: "Lesson 4", description: "Expert", link: '/(drawer)/(guide)/ExpertGuide' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  drawerIcon: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
});

export default Index;

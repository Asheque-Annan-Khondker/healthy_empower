import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AchievementWall from '@/components/achievements/AchievementWall';
import UnifiedFAB from '@/components/UnifiedFAB';

export default function AchievementScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Achievement Wall */}
      <AchievementWall />
      
      {/* Unified FAB System */}
      <UnifiedFAB 
        screenType="achievements"
        onFoodAdded={() => console.log('Food added from achievements screen')}
        onMealAdded={() => console.log('Meal added from achievements screen')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F4',
  },
});
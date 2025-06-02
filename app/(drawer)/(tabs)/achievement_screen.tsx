import React from 'react';
import { View, StyleSheet } from 'react-native';
import AchievementWall from '@/components/achievements/AchievementWall';
import UnifiedFAB from '@/components/UnifiedFAB';

export default function AchievementScreen() {
  return (
    <View style={styles.container}>
      <AchievementWall />
      
      {/* Unified FAB System */}
      <UnifiedFAB 
        screenType="achievements"
        onFoodAdded={() => console.log('Food added from achievements screen')}
        onMealAdded={() => console.log('Meal added from achievements screen')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F4',
  },
});
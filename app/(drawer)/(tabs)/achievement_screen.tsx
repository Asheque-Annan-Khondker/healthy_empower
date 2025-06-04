import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AchievementWall from '@/components/achievements/AchievementWall';

export default function AchievementScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Achievement Wall */}
      <AchievementWall />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F4',
  },
});
import React from 'react';
import { View, StyleSheet } from 'react-native';
import AchievementWall from '@/components/achievements/AchievementWall';

export default function AchievementScreen() {
  return (
    <View style={styles.container}>
      <AchievementWall />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F4',
  },
});
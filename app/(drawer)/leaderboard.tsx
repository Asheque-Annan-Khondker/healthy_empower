import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Leaderboard from '../../components/Leaderboard';

const LeaderboardScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Leaderboard />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
});

export default LeaderboardScreen;
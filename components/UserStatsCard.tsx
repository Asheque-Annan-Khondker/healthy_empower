import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';

interface UserStatsCardProps {
  username?: string;
  rank?: number;
  streakDays?: number;
  acorns?: number;
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ 
  username = 'User', 
  rank = 0, 
  streakDays = 0, 
  acorns = 0 
}) => {
  // Simple ordinal suffix function
  function getOrdinalSuffix(num: number): string {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return num + "st";
    if (j === 2 && k !== 12) return num + "nd";
    if (j === 3 && k !== 13) return num + "rd";
    return num + "th";
  }

  return (
    <Surface style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.rankText}>Ranked {getOrdinalSuffix(rank)}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{streakDays}</Text>
            <Text style={styles.statLabel}>days streak</Text>
          </View>
          
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{acorns}</Text>
            <Text style={styles.statLabel}>acorns</Text>
          </View>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: 'white',
  },
  cardContent: {
    padding: 16,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3A2A1F',
  },
  rankText: {
    fontSize: 14,
    color: '#9B8579',
    textAlign: 'center',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(214, 141, 84, 0.2)',
  },
  statBlock: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D68D54',
  },
  statLabel: {
    fontSize: 12,
    color: '#9B8579',
  },
});

export default UserStatsCard;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CurrencyStreakIndicator = ({ chestnuts = 250, streakDays = 5 }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.fireEmoji}>🔥</Text>
        <Text style={styles.streakText}>{streakDays}</Text>
      </View>
      
      <Text style={styles.divider}>|</Text>
      
      <View style={styles.rightSection}>
        <Text style={styles.currencyText}>{chestnuts}</Text>
        <Text style={styles.chestnutEmoji}>🌰</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    width: 'auto',
    alignSelf: 'flex-end',
    marginRight: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  divider: {
    color: '#ddd',
    fontSize: 16,
    fontWeight: '200',
  },
  fireEmoji: {
    fontSize: 14,
    marginRight: 3,
  },
  streakText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  currencyText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginRight: 3,
  },
  chestnutEmoji: {
    fontSize: 14,
  }
});

export default CurrencyStreakIndicator;
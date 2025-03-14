// ResumeButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ResumeButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.resumeButton} onPress={onPress}>
      <Ionicons name="play" size={16} color="#8465c2" />
      <Text style={styles.resumeButtonText}>Resume</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  resumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Ensure text and icon are centered
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0eef4',
    width: 'auto', // Avoid full width stretching
    alignSelf: 'center', // Prevent stretching across the container
  },
  resumeButtonText: {
    marginLeft: 5,
    color: '#8465c2',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ResumeButton;

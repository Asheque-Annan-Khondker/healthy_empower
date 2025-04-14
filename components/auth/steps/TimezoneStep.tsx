import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface TimezoneStepProps {
  timezone: string;
  setTimezone: (timezone: string) => void;
  handleNext: () => void;
  handleBack: () => void;
  errorMessage: string;
}

const TimezoneStep: React.FC<TimezoneStepProps> = ({
  timezone,
  setTimezone,
  handleNext,
  handleBack,
  errorMessage
}) => {
  // Simple list of common timezones for demonstration
  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney',
    'UTC'
  ];
  
  return (
    <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select your timezone</Text>
      <Text style={styles.stepDescription}>This helps us show you correct times</Text>
      
      <ScrollView style={styles.timezoneList}>
        {timezones.map((tz) => (
          <TouchableOpacity
            key={tz}
            style={[styles.timezoneOption, timezone === tz && styles.timezoneOptionSelected]}
            onPress={() => setTimezone(tz)}
          >
            <Text style={[styles.timezoneText, timezone === tz && styles.timezoneTextSelected]}>{tz}</Text>
            {timezone === tz && <Ionicons name="checkmark" size={20} color="#D68D54" />}
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {errorMessage ? <Text style={styles.inputError}>{errorMessage}</Text> : null}
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={22} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
        >
          <LinearGradient 
            colors={['#D68D54', '#B25B28']} 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 30,
  },
  timezoneList: {
    width: '100%',
    maxHeight: 220,
    marginBottom: 25,
  },
  timezoneOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  timezoneOptionSelected: {
    backgroundColor: 'rgba(214, 141, 84, 0.2)',
    borderWidth: 1,
    borderColor: '#D68D54',
  },
  timezoneText: {
    color: 'white',
    fontSize: 16,
  },
  timezoneTextSelected: {
    color: '#D68D54',
    fontWeight: 'bold',
  },
  inputError: {
    color: '#FF5757',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    flex: 1,
    marginLeft: 15,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  nextButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TimezoneStep;
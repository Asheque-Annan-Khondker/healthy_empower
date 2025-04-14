import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface DateOfBirthStepProps {
  day: string;
  month: string;
  year: string;
  setDay: (day: string) => void;
  setMonth: (month: string) => void;
  setYear: (year: string) => void;
  handleNext: () => void;
  handleBack: () => void;
  errorMessage: string;
}

const DateOfBirthStep: React.FC<DateOfBirthStepProps> = ({ 
  day, 
  month, 
  year, 
  setDay, 
  setMonth, 
  setYear, 
  handleNext, 
  handleBack, 
  errorMessage 
}) => (
  <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)} style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Date of Birth</Text>
    <Text style={styles.stepDescription}>Enter your birth date</Text>
    
    <View style={styles.dobContainer}>
      <View style={styles.dobInputContainer}>
        <Text style={styles.dobLabel}>Day</Text>
        <TextInput
          style={styles.dobInput}
          value={day}
          onChangeText={setDay}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="DD"
          placeholderTextColor="rgba(255,255,255,0.3)"
        />
      </View>
      
      <View style={styles.dobInputContainer}>
        <Text style={styles.dobLabel}>Month</Text>
        <TextInput
          style={styles.dobInput}
          value={month}
          onChangeText={setMonth}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="MM"
          placeholderTextColor="rgba(255,255,255,0.3)"
        />
      </View>
      
      <View style={styles.dobInputContainer}>
        <Text style={styles.dobLabel}>Year</Text>
        <TextInput
          style={styles.dobInput}
          value={year}
          onChangeText={setYear}
          keyboardType="number-pad"
          maxLength={4}
          placeholder="YYYY"
          placeholderTextColor="rgba(255,255,255,0.3)"
        />
      </View>
    </View>
    
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
  dobContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 25,
  },
  dobInputContainer: {
    width: '30%',
  },
  dobLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
    textAlign: 'center',
  },
  dobInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    height: 50,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
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

export default DateOfBirthStep;
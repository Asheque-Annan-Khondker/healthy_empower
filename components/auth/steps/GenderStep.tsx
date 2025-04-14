import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface GenderStepProps {
  gender: string;
  setGender: (gender: string) => void;
  handleNext: () => void;
  handleBack: () => void;
  errorMessage: string;
}

const GenderStep: React.FC<GenderStepProps> = ({ 
  gender, 
  setGender, 
  handleNext, 
  handleBack, 
  errorMessage 
}) => (
  <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)} style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Select your gender</Text>
    <Text style={styles.stepDescription}>This helps us personalize your experience</Text>
    
    <View style={styles.genderOptions}>
      <TouchableOpacity
        style={[styles.genderOption, gender === 'male' && styles.genderOptionSelected]}
        onPress={() => setGender('male')}
      >
        <Ionicons 
          name="male" 
          size={36} 
          color={gender === 'male' ? '#D68D54' : 'rgba(255,255,255,0.7)'} 
        />
        <Text style={[styles.genderText, gender === 'male' && styles.genderTextSelected]}>Male</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.genderOption, gender === 'female' && styles.genderOptionSelected]}
        onPress={() => setGender('female')}
      >
        <Ionicons 
          name="female" 
          size={36} 
          color={gender === 'female' ? '#D68D54' : 'rgba(255,255,255,0.7)'} 
        />
        <Text style={[styles.genderText, gender === 'female' && styles.genderTextSelected]}>Female</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.genderOption, gender === 'other' && styles.genderOptionSelected]}
        onPress={() => setGender('other')}
      >
        <Ionicons 
          name="person" 
          size={36} 
          color={gender === 'other' ? '#D68D54' : 'rgba(255,255,255,0.7)'} 
        />
        <Text style={[styles.genderText, gender === 'other' && styles.genderTextSelected]}>Other</Text>
      </TouchableOpacity>
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
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 25,
  },
  genderOption: {
    width: '30%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderOptionSelected: {
    backgroundColor: 'rgba(214, 141, 84, 0.2)',
    borderWidth: 1,
    borderColor: '#D68D54',
  },
  genderText: {
    color: 'white',
    marginTop: 8,
    fontSize: 16,
  },
  genderTextSelected: {
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

export default GenderStep;
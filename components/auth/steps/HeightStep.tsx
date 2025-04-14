import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface HeightStepProps {
  height: string;
  setHeight: (height: string) => void;
  heightUnit: string;
  setHeightUnit: (unit: string) => void;
  handleNext: () => void;
  handleBack: () => void;
  errorMessage: string;
}

const HeightStep: React.FC<HeightStepProps> = ({ 
  height, 
  setHeight, 
  heightUnit, 
  setHeightUnit, 
  handleNext, 
  handleBack, 
  errorMessage 
}) => (
  <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)} style={styles.stepContainer}>
    <Text style={styles.stepTitle}>How tall are you?</Text>
    <Text style={styles.stepDescription}>Your height helps us calculate your fitness metrics</Text>
    
    <View style={styles.heightContainer}>
      <View style={styles.heightInputWrapper}>
        <TextInput
          style={styles.heightInput}
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          placeholder={heightUnit === 'cm' ? '175' : '5.9'}
          placeholderTextColor="rgba(255,255,255,0.3)"
        />
        
        <TouchableOpacity
          style={styles.unitToggle}
          onPress={() => setHeightUnit(heightUnit === 'cm' ? 'ft' : 'cm')}
        >
          <Text style={styles.unitText}>{heightUnit}</Text>
          <Ionicons name="swap-vertical" size={16} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.heightTip}>
        {heightUnit === 'cm' 
          ? 'Enter your height in centimeters' 
          : 'Enter your height in feet and inches (e.g., 5.9 for 5\'9")'}
      </Text>
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
  heightContainer: {
    width: '100%',
    marginBottom: 25,
    alignItems: 'center',
  },
  heightInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 10,
  },
  heightInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    height: 60,
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    marginRight: 10,
  },
  unitToggle: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  unitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  heightTip: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
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

export default HeightStep;
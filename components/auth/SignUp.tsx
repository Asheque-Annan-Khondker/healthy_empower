import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence, 
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';


const { width, height } = Dimensions.get('window');

// Configure API base URL - Special IP for Android emulator to access host machine
const API_URL = 'http://10.0.2.2:3001'; // Android emulator special IP for localhost

// Step content components
const EmailStep = ({ email, setEmail, handleNext, errorMessage }) => (
  <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)} style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Enter your email</Text>
    <Text style={styles.stepDescription}>We'll use this to create your account</Text>
    
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="example@email.com"
          placeholderTextColor="rgba(255,255,255,0.3)"
        />
        <Ionicons name="mail" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
      </View>
      {errorMessage ? <Text style={styles.inputError}>{errorMessage}</Text> : null}
    </View>
    
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
  </Animated.View>
);

const UsernameStep = ({ username, setUsername, handleNext, handleBack, errorMessage }) => (
  <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)} style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Choose a username</Text>
    <Text style={styles.stepDescription}>This is how others will see you</Text>
    
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholder="Your username"
          placeholderTextColor="rgba(255,255,255,0.3)"
        />
        <Ionicons name="person" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
      </View>
      {errorMessage ? <Text style={styles.inputError}>{errorMessage}</Text> : null}
    </View>
    
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

const PasswordStep = ({ password, setPassword, handleNext, handleBack, errorMessage }) => (
  <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)} style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Create a password</Text>
    <Text style={styles.stepDescription}>Must be at least 8 characters</Text>
    
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholder="••••••••"
          placeholderTextColor="rgba(255,255,255,0.3)"
        />
        <Ionicons name="lock-closed" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
      </View>
      {errorMessage ? <Text style={styles.inputError}>{errorMessage}</Text> : null}
    </View>
    
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

const ConfirmPasswordStep = ({ password, confirmPassword, setConfirmPassword, handleNext, handleBack, errorMessage }) => (
  <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)} style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Confirm your password</Text>
    <Text style={styles.stepDescription}>Re-enter the password to confirm</Text>
    
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholder="••••••••"
          placeholderTextColor="rgba(255,255,255,0.3)"
        />
        <Ionicons name="lock-closed" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
      </View>
      {errorMessage ? <Text style={styles.inputError}>{errorMessage}</Text> : null}
    </View>
    
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

const GenderStep = ({ gender, setGender, handleNext, handleBack, errorMessage }) => (
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

const DateOfBirthStep = ({ day, month, year, setDay, setMonth, setYear, handleNext, handleBack, errorMessage }) => (
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

const TimezoneStep = ({ timezone, setTimezone, handleNext, handleBack, errorMessage }) => {
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

const HeightStep = ({ height, setHeight, heightUnit, setHeightUnit, handleNext, handleBack, errorMessage }) => (
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

const WeightStep = ({ weight, setWeight, weightUnit, setWeightUnit, handleSubmit, handleBack, isLoading, errorMessage }) => (
  <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)} style={styles.stepContainer}>
    <Text style={styles.stepTitle}>What's your weight?</Text>
    <Text style={styles.stepDescription}>Your weight helps us track your fitness progress</Text>
    
    <View style={styles.weightContainer}>
      <View style={styles.weightInputWrapper}>
        <TextInput
          style={styles.weightInput}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          placeholder={weightUnit === 'kg' ? '70' : '154'}
          placeholderTextColor="rgba(255,255,255,0.3)"
        />
        
        <TouchableOpacity
          style={styles.unitToggle}
          onPress={() => setWeightUnit(weightUnit === 'kg' ? 'lb' : 'kg')}
        >
          <Text style={styles.unitText}>{weightUnit}</Text>
          <Ionicons name="swap-vertical" size={16} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.weightTip}>Don't worry, you can update this anytime</Text>
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
        style={[styles.nextButton, isLoading && styles.nextButtonLoading]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <LinearGradient 
          colors={['#D68D54', '#B25B28']} 
          start={{x: 0, y: 0}} 
          end={{x: 1, y: 0}}
          style={styles.nextButtonGradient}
        >
          <Text style={styles.nextButtonText}>
            {isLoading ? 'Creating account...' : 'Complete Signup'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </Animated.View>
);

// Main component
export default function StepByStepSignUp() {
    // Form state
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('');
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [timezone, setTimezone] = useState('UTC');
    
    // Health profile state
    const [height, setHeight] = useState('');
    const [heightUnit, setHeightUnit] = useState('cm');
    const [weight, setWeight] = useState('');
    const [weightUnit, setWeightUnit] = useState('kg');
    
    // UI state
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
  
    // Date of birth formatted as YYYY-MM-DD
    const getFormattedDOB = () => {
      const paddedMonth = month.padStart(2, '0');
      const paddedDay = day.padStart(2, '0');
      return `${year}-${paddedMonth}-${paddedDay}`;
    };
    
    // Convert height to cm for storage
    const getHeightInCm = () => {
      if (heightUnit === 'cm') {
        return parseFloat(height);
      } else {
        // Convert feet and inches to cm (assuming format like 5.9 for 5'9")
        const feet = parseInt(height);
        const inches = Math.round((parseFloat(height) - feet) * 10);
        return (feet * 30.48) + (inches * 2.54); // 1 foot = 30.48 cm, 1 inch = 2.54 cm
      }
    };
    
    // Convert weight to kg for storage
    const getWeightInKg = () => {
      if (weightUnit === 'kg') {
        return parseFloat(weight);
      } else {
        // Convert pounds to kg
        return parseFloat(weight) * 0.453592; // 1 lb = 0.453592 kg
      }
    };
    
    // Animation values
    const logoScale = useSharedValue(1);
    const logoY = useSharedValue(0);
    
    useEffect(() => {
      // Subtle bouncing animation for the logo
      const startLogoAnimation = () => {
        logoScale.value = withSequence(
          withTiming(1.05, { duration: 800, easing: Easing.out(Easing.sin) }),
          withTiming(0.95, { duration: 800, easing: Easing.in(Easing.sin) })
        );
        
        logoY.value = withSequence(
          withTiming(-5, { duration: 800, easing: Easing.out(Easing.sin) }),
          withTiming(5, { duration: 800, easing: Easing.in(Easing.sin) })
        );
      };
      
      // Start animation and repeat
      startLogoAnimation();
      const interval = setInterval(() => {
        startLogoAnimation();
      }, 1600);
      
      return () => clearInterval(interval);
    }, []);
    
    const logoAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateY: logoY.value },
          { scale: logoScale.value }
        ]
      };
    });
  
    // Progress indicators
    const renderProgressIndicator = () => {
      // Total number of steps (now including height and weight)
      const totalSteps = 9;
      
      return (
        <View style={styles.progressContainer}>
          {Array.from({ length: totalSteps }).map((_, step) => (
            <View 
              key={step} 
              style={[
                styles.progressDot, 
                currentStep === step && styles.progressDotActive,
                currentStep > step && styles.progressDotCompleted
              ]} 
            />
          ))}
        </View>
      );
    };
  
    // Validation functions
    const validateEmail = () => {
      if (!email.trim()) {
        setErrorMessage('Email is required');
        return false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage('Please enter a valid email address');
        return false;
      }
      
      setErrorMessage('');
      return true;
    };
    
    const validateUsername = () => {
      if (!username.trim()) {
        setErrorMessage('Username is required');
        return false;
      }
      
      if (username.length < 3) {
        setErrorMessage('Username must be at least 3 characters');
        return false;
      }
      
      setErrorMessage('');
      return true;
    };
    
    const validatePassword = () => {
      if (!password.trim()) {
        setErrorMessage('Password is required');
        return false;
      }
      
      if (password.length < 8) {
        setErrorMessage('Password must be at least 8 characters');
        return false;
      }
      
      setErrorMessage('');
      return true;
    };
    
    const validateConfirmPassword = () => {
      if (!confirmPassword.trim()) {
        setErrorMessage('Please confirm your password');
        return false;
      }
      
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        return false;
      }
      
      setErrorMessage('');
      return true;
    };
    
    const validateGender = () => {
      if (!gender) {
        setErrorMessage('Please select your gender');
        return false;
      }
      
      setErrorMessage('');
      return true;
    };
    
    const validateDOB = () => {
      if (!day || !month || !year) {
        setErrorMessage('Please enter your complete date of birth');
        return false;
      }
      
      const dayNum = parseInt(day, 10);
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);
      
      if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
        setErrorMessage('Please enter valid numbers');
        return false;
      }
      
      if (dayNum < 1 || dayNum > 31) {
        setErrorMessage('Day must be between 1 and 31');
        return false;
      }
      
      if (monthNum < 1 || monthNum > 12) {
        setErrorMessage('Month must be between 1 and 12');
        return false;
      }
      
      const currentYear = new Date().getFullYear();
      if (yearNum < 1900 || yearNum > currentYear) {
        setErrorMessage(`Year must be between 1900 and ${currentYear}`);
        return false;
      }
      
      // Basic date validation
      const date = new Date(yearNum, monthNum - 1, dayNum);
      if (date.getDate() !== dayNum || date.getMonth() !== monthNum - 1) {
        setErrorMessage('Invalid date');
        return false;
      }
      
      setErrorMessage('');
      return true;
    };
    
    const validateTimezone = () => {
      if (!timezone) {
        setErrorMessage('Please select your timezone');
        return false;
      }
      
      setErrorMessage('');
      return true;
    };
    
    const validateHeight = () => {
      if (!height) {
        setErrorMessage('Please enter your height');
        return false;
      }
      
      const heightValue = parseFloat(height);
      if (isNaN(heightValue) || heightValue <= 0) {
        setErrorMessage('Please enter a valid height');
        return false;
      }
      
      // Reasonable height range validation
      if (heightUnit === 'cm') {
        if (heightValue < 50 || heightValue > 250) {
          setErrorMessage('Height should be between 50 and 250 cm');
          return false;
        }
      } else {
        // For feet (assuming format like 5.9 for 5'9")
        const feet = parseInt(height);
        const inches = Math.round((parseFloat(height) - feet) * 10);
        
        if (feet < 1 || feet > 8 || isNaN(inches) || inches < 0 || inches > 11) {
          setErrorMessage('Please enter a valid height (e.g., 5.9 for 5\'9")');
          return false;
        }
      }
      
      setErrorMessage('');
      return true;
    };
    
    const validateWeight = () => {
      if (!weight) {
        setErrorMessage('Please enter your weight');
        return false;
      }
      
      const weightValue = parseFloat(weight);
      if (isNaN(weightValue) || weightValue <= 0) {
        setErrorMessage('Please enter a valid weight');
        return false;
      }
      
      // Reasonable weight range validation
      if (weightUnit === 'kg') {
        if (weightValue < 20 || weightValue > 250) {
          setErrorMessage('Weight should be between 20 and 250 kg');
          return false;
        }
      } else {
        // For pounds
        if (weightValue < 45 || weightValue > 550) {
          setErrorMessage('Weight should be between 45 and 550 lb');
          return false;
        }
      }
      
      setErrorMessage('');
      return true;
    };
  
    // Navigation handlers
    const handleNext = () => {
      // Validate current step
      let isValid = false;
      
      switch (currentStep) {
        case 0: // Email step
          isValid = validateEmail();
          break;
        case 1: // Username step
          isValid = validateUsername();
          break;
        case 2: // Password step
          isValid = validatePassword();
          break;
        case 3: // Confirm password step
          isValid = validateConfirmPassword();
          break;
        case 4: // Gender step
          isValid = validateGender();
          break;
        case 5: // DOB step
          isValid = validateDOB();
          break;
        case 6: // Timezone step
          isValid = validateTimezone();
          break;
        case 7: // Height step
          isValid = validateHeight();
          break;
        default:
          isValid = true;
      }
      
      if (isValid) {
        setCurrentStep(currentStep + 1);
        setErrorMessage('');
      }
    };
    
    const handleBack = () => {
      setCurrentStep(currentStep - 1);
      setErrorMessage('');
    };
    
    const handleSubmit = async () => {
        if (!validateWeight()) {
          return;
        }
        
        setIsLoading(true);
        setErrorMessage('');
        
        try {
            // Step 1: Create user account
          const userResponse = await axios.post(`${API_URL}/api/users`, {
            username,
            email,
            password,
            date_of_birth: getFormattedDOB(),
            gender,
            timezone
          });
            
          Alert.alert(
            "User Created", 
            `User ${username} created successfully`,
            [{ text: "Continue" }]
          );

          await new Promise(r => setTimeout(r, 2000))
            
            // Step 3: Get user by email to get the ID
            const userByEmailResponse = await axios.get(
              `${API_URL}/api/users/by-email?email=${encodeURIComponent(email)}`
            );
            
            // Display the response data properly
            console.log("Response data:", userByEmailResponse.data);
            
            // For visual debugging, show an alert with the formatted data
            Alert.alert(
              "User Data", 
              JSON.stringify(userByEmailResponse.data.id, null, 2)
            );

            const userId = userByEmailResponse.data.id; 

            console.log(userId);
            
            const healthProfileResponse = await axios.post(
              `${API_URL}/api/users/${userId}/health-profile`,
              {
                height: getHeightInCm(),
                weight: getWeightInKg()
              }
            );

            console.log(JSON.stringify(healthProfileResponse));
            
         /* const userId = userByEmailResponse.data.id || userByEmailResponse.data.user_id;
            
          if (!userId) {
            throw new Error("Could not retrieve user ID");
          }
            
          Alert.alert("Found User ID", `ID: ${userId}`);
          /*  
            // Step 4: Create health profile with the retrieved ID
          const healthProfileResponse = await axios.post(
            `${API_URL}/api/users/${userId}/health-profile`, 
            {
              height: getHeightInCm(),
              weight: getWeightInKg()
            }
          );
            
          Alert.alert("Health Profile Created", "Success!");
           */ 
            // Success flow
          Alert.alert(
            "Account Created",
            "Your account has been created successfully. Please sign in with your credentials.",
            [
              { 
                text: "OK", 
                onPress: () => {
                  router.replace({
                    pathname: '/',
                    params: { email }
                  });
                } 
              }
            ]
          );
         
        } catch (error) {
          console.error('Signup error:', error);
          
          // Detailed error logging
          if (error.response) {
            // The server responded with an error status
            console.error('Server error details:', {
              status: error.response.status,
              data: error.response.data,
              headers: error.response.headers
            });
            
            const status = error.response.status;
            
            if (status === 409) {
              setErrorMessage('Email already exists. Please use a different email.');
            } else if (status === 400) {
              setErrorMessage(error.response.data?.error || 'Please check your inputs');
            } else if (status === 500) {
              setErrorMessage('Server error. Please try again later or contact support.');
            } else {
              setErrorMessage(`Signup failed with status ${status}. Please try again later.`);
            }
          } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
            setErrorMessage('Network error. Please check your connection.');
          } else {
            // Something else happened
            console.error('Error details:', error.message);
            setErrorMessage(`An unexpected error occurred: ${error.message}`);
          }
        } finally {
          setIsLoading(false);
        }
      };
  
    // Render current step
    const renderCurrentStep = () => {
      switch (currentStep) {
        case 0:
          return (
            <EmailStep 
              email={email} 
              setEmail={setEmail} 
              handleNext={handleNext}
              errorMessage={errorMessage}
            />
          );
        case 1:
          return (
            <UsernameStep 
              username={username} 
              setUsername={setUsername} 
              handleNext={handleNext}
              handleBack={handleBack}
              errorMessage={errorMessage}
            />
          );
        case 2:
          return (
            <PasswordStep 
              password={password} 
              setPassword={setPassword} 
              handleNext={handleNext}
              handleBack={handleBack}
              errorMessage={errorMessage}
            />
          );
        case 3:
          return (
            <ConfirmPasswordStep 
              password={password}
              confirmPassword={confirmPassword} 
              setConfirmPassword={setConfirmPassword} 
              handleNext={handleNext}
              handleBack={handleBack}
              errorMessage={errorMessage}
            />
          );
        case 4:
          return (
            <GenderStep 
              gender={gender} 
              setGender={setGender} 
              handleNext={handleNext}
              handleBack={handleBack}
              errorMessage={errorMessage}
            />
          );
        case 5:
          return (
            <DateOfBirthStep 
              day={day}
              month={month}
              year={year}
              setDay={setDay}
              setMonth={setMonth}
              setYear={setYear}
              handleNext={handleNext}
              handleBack={handleBack}
              errorMessage={errorMessage}
            />
          );
        case 6:
          return (
            <TimezoneStep 
              timezone={timezone} 
              setTimezone={setTimezone} 
              handleNext={handleNext}
              handleBack={handleBack}
              errorMessage={errorMessage}
            />
          );
        case 7:
          return (
            <HeightStep 
              height={height}
              setHeight={setHeight}
              heightUnit={heightUnit}
              setHeightUnit={setHeightUnit}
              handleNext={handleNext}
              handleBack={handleBack}
              errorMessage={errorMessage}
            />
          );
        case 8:
          return (
            <WeightStep 
              weight={weight}
              setWeight={setWeight}
              weightUnit={weightUnit}
              setWeightUnit={setWeightUnit}
              handleSubmit={handleSubmit}
              handleBack={handleBack}
              isLoading={isLoading}
              errorMessage={errorMessage}
            />
          );
        default:
          return null;
      }
    };
  
    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <StatusBar style="light" />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Animated.View style={logoAnimatedStyle}>
              <LinearGradient 
                colors={['#D68D54', '#B25B28']} 
                start={{x: 0, y: 0}} 
                end={{x: 1, y: 1}}
                style={styles.logoBackground}
              >
                <Image 
                  source={require('../../assets/images/squirrel_flex.png')} 
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </LinearGradient>
            </Animated.View>
          </View>
          
          {renderProgressIndicator()}
          
          {renderCurrentStep()}
          
          <TouchableOpacity 
            style={styles.loginLink}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.loginLinkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#3A2A1F', // Dark brown background
    },
    scrollContent: {
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100%',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 40,
    },
    logoBackground: {
      width: 90,
      height: 90,
      borderRadius: 45,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#D68D54',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.7,
      shadowRadius: 10,
      elevation: 10,
    },
    logoImage: {
      width: 55,
      height: 55,
    },
    progressContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 30,
    },
    progressDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255,255,255,0.3)',
      marginHorizontal: 4,
    },
    progressDotActive: {
      backgroundColor: '#D68D54',
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    progressDotCompleted: {
      backgroundColor: 'rgba(214, 141, 84, 0.7)',
    },
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
    inputContainer: {
      width: '100%',
      marginBottom: 25,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 8,
      height: 50,
      paddingHorizontal: 16,
    },
    input: {
      flex: 1,
      color: 'white',
      fontSize: 16,
      height: '100%',
    },
    inputIcon: {
      marginLeft: 10,
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
    nextButtonLoading: {
      opacity: 0.8,
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
    loginLink: {
      marginTop: 10,
      marginBottom: 40,
    },
    loginLinkText: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 14,
      textDecorationLine: 'underline',
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
    // Height and weight specific styles
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
    weightContainer: {
      width: '100%',
      marginBottom: 25,
      alignItems: 'center',
    },
    weightInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '80%',
      marginBottom: 10,
    },
    weightInput: {
      flex: 1,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 8,
      height: 60,
      color: 'white',
      fontSize: 24,
      textAlign: 'center',
      marginRight: 10,
    },
    weightTip: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: 14,
      textAlign: 'center',
    },
  });
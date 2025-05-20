import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence, 
  Easing,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import {API_URL} from "@/constants/DBAPI";

// Import the step components
import EmailStep from './steps/EmailStep';
import UsernameStep from './steps/UsernameStep';
import PasswordStep from './steps/PasswordStep';
import ConfirmPasswordStep from './steps/ConfirmPasswordStep';
import GenderStep from './steps/GenderStep';
import DateOfBirthStep from './steps/DateOfBirthStep';
import TimezoneStep from './steps/TimezoneStep';
import HeightStep from './steps/HeightStep';
import WeightStep from './steps/WeightStep';

// Import validation utilities
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateConfirmPassword,
  validateGender,
  validateDOB,
  validateTimezone,
  validateHeight,
  validateWeight
} from '../utils/validationUtils';

export var USER_ID: number;

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
  
    // Navigation handlers
    const handleNext = () => {
      // Validate current step using the external validation functions
      let isValid = false;
      
      switch (currentStep) {
        case 0: // Email step
          isValid = validateEmail(email, setErrorMessage);
          break;
        case 1: // Username step
          isValid = validateUsername(username, setErrorMessage);
          break;
        case 2: // Password step
          isValid = validatePassword(password, setErrorMessage);
          break;
        case 3: // Confirm password step
          isValid = validateConfirmPassword(password, confirmPassword, setErrorMessage);
          break;
        case 4: // Gender step
          isValid = validateGender(gender, setErrorMessage);
          break;
        case 5: // DOB step
          isValid = validateDOB(day, month, year, setErrorMessage);
          break;
        case 6: // Timezone step
          isValid = validateTimezone(timezone, setErrorMessage);
          break;
        case 7: // Height step
          isValid = validateHeight(height, heightUnit, setErrorMessage);
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
        if (!validateWeight(weight, weightUnit, setErrorMessage)) {
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

          await new Promise(r => setTimeout(r, 2000));
            
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
            USER_ID = userId

            console.log(userId);
            
            const healthProfileResponse = await axios.post(
              `${API_URL}/api/users/${userId}/health-profile`,
              {
                height: getHeightInCm(),
                weight: getWeightInKg()
              }
            );

            console.log(JSON.stringify(healthProfileResponse));
            
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
        case 0: // Email step
          return (
            <EmailStep 
              email={email} 
              setEmail={setEmail} 
              handleNext={handleNext}
              errorMessage={errorMessage}
            />
          );
        case 1: // Username step
          return (
            <UsernameStep 
              username={username} 
              setUsername={setUsername} 
              handleNext={handleNext}
              handleBack={handleBack}
              errorMessage={errorMessage}
            />
          );
        case 2: // Password step
          return (
            <PasswordStep 
              password={password} 
              setPassword={setPassword} 
              handleNext={handleNext}
              handleBack={handleBack}
              errorMessage={errorMessage}
            />
          );
        case 3: // Confirm password step
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
        case 4: // Gender step
          return (
            <GenderStep 
              gender={gender} 
              setGender={setGender} 
              handleNext={handleNext}
              handleBack={handleBack}
              errorMessage={errorMessage}
            />
          );
        case 5: // DOB step
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
        case 6: // Timezone step
          return (
            <TimezoneStep 
              timezone={timezone} 
              setTimezone={setTimezone} 
              handleNext={handleNext}
              handleBack={handleBack}
              errorMessage={errorMessage}
            />
          );
        case 7: // Height step
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
        case 8: // Weight step
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
              <View style={styles.logoBackground}>
                <Image 
                  source={require('../../assets/images/squirrel_flex.png')} 
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
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
    backgroundColor: '#D68D54',
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
  loginLink: {
    marginTop: 10,
    marginBottom: 40,
  },
  loginLinkText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

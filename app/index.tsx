import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import Svg, { Path } from 'react-native-svg';

const TIGER_IMAGE = require('../assets/images/chibi_tiger_transparent_background_tolerance-2lqCZHhQGnoaS0gplGH7qe0NWygkFU.png');

const ProgressBar = ({ progress }) => {
  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress}%` }]} />
    </View>
  );
};


const BackButton = ({ onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.backButton}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Svg 
        width={16} 
        height={16} 
        viewBox="0 0 24 24" 
        stroke="#666"
        strokeWidth={2}
        fill="none"
        style={styles.icon}
      >
        <Path d="M15 18l-6-6 6-6" />
      </Svg>
      <Text style={styles.backButtonText}>Back</Text>
    </TouchableOpacity>
  );
};

const NextButton = ({ onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.nextButton}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={styles.nextButtonText}>Next</Text>
      <Svg 
        width={16} 
        height={16} 
        viewBox="0 0 24 24" 
        stroke="white"
        strokeWidth={2}
        fill="none"
        style={styles.icon}
      >
        <Path d="M9 6l6 6-6 6" />
      </Svg>
    </TouchableOpacity>
  );
};

export default function Index() {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [weightGoal, setWeightGoal] = useState('');
  const [weightChange, setWeightChange] = useState('');

  const totalSteps = 11; 
  const progress = ((step + 1) / totalSteps) * 100;

  const nextStep = () => setStep(prevStep => Math.min(prevStep + 1, totalSteps - 1));
  const prevStep = () => setStep(prevStep => Math.max(0, prevStep - 1));

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View>
            <Image 
              source={TIGER_IMAGE}
              style={styles.headerImage}
              resizeMode="contain"
            />
            <Text style={styles.headerText}>Choose a username</Text>
            <Text style={styles.subtitleText}>What should we call you? 🤔</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter username"
                value={username}
                onChangeText={setUsername}
              />
            </View>
          </View>
        );
      case 1:
        return (
          <View>
            <Image 
              source={TIGER_IMAGE}
              style={styles.headerImage}
              resizeMode="contain"
            />
            <Text style={styles.headerText}>Enter your email</Text>
            <Text style={styles.subtitleText}>How can we talk to you? 😄</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
          </View>
        );
      case 2:
        return (
          <View>
            <Image 
              source={TIGER_IMAGE}
              style={styles.headerImage}
              resizeMode="contain"
            />
            <Text style={styles.headerText}>Create a password</Text>
            <Text style={styles.subtitleText}>Keep your account secure!! 🏋️</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>
        );
      case 3:
        return (
          <View>
            <Image 
              source={TIGER_IMAGE}
              style={styles.headerImage}
              resizeMode="contain"
            />
            <Text style={styles.headerText}>Confirm password</Text>
            <Text style={styles.subtitleText}>Keep your account secure!! 🏋️</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </View>
        );
      case 4:
        return (
          <View>
            <Image 
              source={TIGER_IMAGE}
              style={styles.headerImage}
              resizeMode="contain"
            />
            <Text style={styles.headerText}>Gender</Text>
            <Text style={styles.subtitleText}>This helps us personalize your experience!</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Gender</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter gender"
                value={gender}
                onChangeText={setGender}
              />
            </View>
          </View>
        );
      case 5:
        return (
          <View>
            <Image 
              source={TIGER_IMAGE}
              style={styles.headerImage}
              resizeMode="contain"
            />
            <Text style={styles.headerText}>Date of Birth</Text>
            <Text style={styles.subtitleText}>We wanna celebrate you! 🍰😄</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Birth Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
              />
            </View>
          </View>
        );
      case 6:
        return (
          <View>
            <Image 
              source={TIGER_IMAGE}
              style={styles.headerImage}
              resizeMode="contain"
            />
            <Text style={styles.headerText}>Your Height</Text>
            <Text style={styles.subtitleText}>How tall are you?</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter height in cm"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
            </View>
          </View>
        );
      case 7:
        return (
          <View>
            <Image 
              source={TIGER_IMAGE}
              style={styles.headerImage}
              resizeMode="contain"
            />
            <Text style={styles.headerText}>Your Weight</Text>
            <Text style={styles.subtitleText}>What's your current weight?</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter weight in kg"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
            </View>
          </View>
        );
      case 8:
        return (
          <View>
            <Image 
              source={TIGER_IMAGE}
              style={styles.headerImage}
              resizeMode="contain"
            />
            <Text style={styles.headerText}>Activity Level</Text>
            <Text style={styles.subtitleText}>How active are you on a daily basis?!</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Activity Level</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter activity level"
                value={activityLevel}
                onChangeText={setActivityLevel}
              />
            </View>
          </View>
        );
      case 9:
        return (
          <View>
            <Image 
              source={TIGER_IMAGE}
              style={styles.headerImage}
              resizeMode="contain"
            />
            <Text style={styles.headerText}>Weight Goal</Text>
            <Text style={styles.subtitleText}>What's your goal?</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Amount (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount to gain per week"
                value={weightGoal}
                onChangeText={setWeightGoal}
                keyboardType="numeric"
              />
            </View>
          </View>
        );
      case 10:
        return (
          <View>
            <Image 
              source={TIGER_IMAGE}
              style={styles.headerImage}
              resizeMode="contain"
            />
            <Text style={styles.headerText}>Weight Change</Text>
            <Text style={styles.subtitleText}>How much weight do you want to maintain?</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Change per week (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter desired weight change (e.g., -0.5 for loss)"
                value={weightChange}
                onChangeText={setWeightChange}
                keyboardType="numeric"
              />
            </View>
          </View>
        );
      default:
        return (
          <View>
            <Image 
              source={TIGER_IMAGE}
              style={styles.headerImage}
              resizeMode="contain"
            />
            <Text style={styles.headerText}>Profile Complete!</Text>
            <Text style={styles.subtitleText}>Here's your information:</Text>
            <View style={styles.inputContainer}>
              <Text>Username: {username}</Text>
              <Text>Email: {email}</Text>
              <Text>Gender: {gender}</Text>
              <Text>Date of Birth: {dateOfBirth}</Text>
              <Text>Height: {height} cm</Text>
              <Text>Weight: {weight} kg</Text>
              <Text>Activity Level: {activityLevel}</Text>
              <Text>Weight Goal: {weightGoal} kg</Text>
              <Text>Weight Change: {weightChange} kg/week</Text>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderStep()}
          <View style={styles.buttonContainer}>
            {step > 0 && (
              <BackButton onPress={prevStep} />
            )}
            {step < totalSteps - 1 && (
              <NextButton onPress={nextStep} />
            )}
          </View>
          <ProgressBar progress={progress} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  keyboardAvoidingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
    justifyContent: 'center',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E2E2',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'black',
    borderRadius: 5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  icon: {
    marginRight: 4,
    marginLeft: 2
  },
  backButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  headerText: {
    fontSize: 32,
    fontWeight: '600'
  },
  subtitleText: {
    fontSize: 14
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  nextButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
    marginRight: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 8,
  },
  inputContainer: {
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  headerImage: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, KeyboardAvoidingView, Alert, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import {API_URL} from "@/constants/DBAPI";

const SimpleDateInput = ({ value, onChange }) => {
  const [year, setYear] = useState(value.split('-')[0] || '1990');
  const [month, setMonth] = useState(value.split('-')[1] || '01');
  const [day, setDay] = useState(value.split('-')[2] || '01');

  const updateDate = (y, m, d) => {
    const formattedMonth = m.padStart(2, '0');
    const formattedDay = d.padStart(2, '0');
    onChange(`${y}-${formattedMonth}-${formattedDay}`);
  };

  return (
    <View style={styles.dateContainer}>
      <View style={styles.dateInputContainer}>
        <Text style={styles.dateLabel}>Year</Text>
        <TextInput
          style={styles.dateInput}
          value={year}
          onChangeText={(text) => {
            setYear(text);
            updateDate(text, month, day);
          }}
          keyboardType="number-pad"
          maxLength={4}
          placeholder="YYYY"
          placeholderTextColor="rgba(255,255,255,0.3)"
        />
      </View>
      <View style={styles.dateInputContainer}>
        <Text style={styles.dateLabel}>Month</Text>
        <TextInput
          style={styles.dateInput}
          value={month}
          onChangeText={(text) => {
            setMonth(text);
            updateDate(year, text, day);
          }}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="MM"
          placeholderTextColor="rgba(255,255,255,0.3)"
        />
      </View>
      <View style={styles.dateInputContainer}>
        <Text style={styles.dateLabel}>Day</Text>
        <TextInput
          style={styles.dateInput}
          value={day}
          onChangeText={(text) => {
            setDay(text);
            updateDate(year, month, text);
          }}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="DD"
          placeholderTextColor="rgba(255,255,255,0.3)"
        />
      </View>
    </View>
  );
};

export default function ProfileDetailsScreen() {
    const params = useLocalSearchParams();
    const { username, email, password } = params;
    
    const [dateOfBirth, setDateOfBirth] = useState('1990-01-01');
    const [gender, setGender] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [timezone, setTimezone] = useState('UTC');
    
    // Handle gender selection
    const selectGender = (selectedGender) => {
      setGender(selectedGender);
      setErrorMessage('');
    };
    
    const validateInputs = () => {
        if (!gender) {
            setErrorMessage('Please select your gender');
            return false;
        }
        
        // Check if date of birth is valid
        const [year, month, day] = dateOfBirth.split('-').map(Number);
        
        if (!year || !month || !day || 
            isNaN(year) || isNaN(month) || isNaN(day) ||
            year < 1900 || year > new Date().getFullYear() ||
            month < 1 || month > 12 ||
            day < 1 || day > 31) {
            setErrorMessage('Please enter a valid date of birth');
            return false;
        }
        
        // Create date object for further validation
        const dobDate = new Date(year, month - 1, day);
        const today = new Date();
        
        if (dobDate > today) {
            setErrorMessage('Date of birth cannot be in the future');
            return false;
        }
        
        setErrorMessage('');
        return true;
    };
    
    const handleCompleteSignup = async () => {
        if (!validateInputs()) {
            return;
        }
        
        setIsLoading(true);
        setErrorMessage('');
        
        try {
            // Make API call to backend signup endpoint
            const response = await axios.post(`${API_URL}/api/users`, {
                username,
                email,
                password,
                date_of_birth: dateOfBirth,
                gender,
                timezone
            });
            
            // If successful, navigate to login page with the email pre-filled
            Alert.alert(
                "Account Created",
                "Your account has been created successfully. Please sign in with your credentials.",
                [
                    { 
                        text: "OK", 
                        onPress: () => {
                            // Navigate to login and pass the email as a parameter
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
            
            // Handle different error scenarios
            if (error.response) {
                // The server responded with an error status
                const status = error.response.status;
                
                if (status === 409) {
                    setErrorMessage('Email already exists. Please use a different email.');
                } else if (status === 400) {
                    setErrorMessage(error.response.data?.error || 'Please check your inputs');
                } else {
                    setErrorMessage('Signup failed. Please try again later.');
                }
            } else if (error.request) {
                // The request was made but no response was received
                setErrorMessage('Network error. Please check your connection.');
            } else {
                // Something else happened
                setErrorMessage('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
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
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Almost Done!</Text>
                    <Text style={styles.headerSubtitle}>Let's complete your profile</Text>
                </View>
                
                {errorMessage ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
                ) : null}
                
                <View style={styles.formContainer}>
                    <View style={styles.formSection}>
                        <Text style={styles.sectionLabel}>Date of Birth</Text>
                        <SimpleDateInput 
                          value={dateOfBirth} 
                          onChange={(date) => {
                            setDateOfBirth(date);
                            setErrorMessage('');
                          }} 
                        />
                    </View>
                    
                    <View style={styles.formSection}>
                        <Text style={styles.sectionLabel}>Gender</Text>
                        <View style={styles.genderContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.genderOption,
                                    gender === 'male' && styles.genderOptionSelected
                                ]}
                                onPress={() => selectGender('male')}
                            >
                                <Ionicons 
                                    name="male" 
                                    size={24} 
                                    color={gender === 'male' ? '#D68D54' : 'rgba(255,255,255,0.7)'} 
                                />
                                <Text style={styles.genderText}>Male</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[
                                    styles.genderOption,
                                    gender === 'female' && styles.genderOptionSelected
                                ]}
                                onPress={() => selectGender('female')}
                            >
                                <Ionicons 
                                    name="female" 
                                    size={24} 
                                    color={gender === 'female' ? '#D68D54' : 'rgba(255,255,255,0.7)'} 
                                />
                                <Text style={styles.genderText}>Female</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[
                                    styles.genderOption,
                                    gender === 'other' && styles.genderOptionSelected
                                ]}
                                onPress={() => selectGender('other')}
                            >
                                <Ionicons 
                                    name="person" 
                                    size={24} 
                                    color={gender === 'other' ? '#D68D54' : 'rgba(255,255,255,0.7)'} 
                                />
                                <Text style={styles.genderText}>Other</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.formSection}>
                        <Text style={styles.sectionLabel}>Timezone</Text>
                        <TouchableOpacity 
                            style={styles.timezoneButton}
                            onPress={() => setTimezone('America/New_York')}
                        >
                            <Text style={styles.timezoneText}>{timezone}</Text>
                            <Text style={styles.timezoneHint}>(Using default: UTC)</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                <TouchableOpacity 
                    style={[styles.completeButton, isLoading && styles.completeButtonLoading]}
                    onPress={handleCompleteSignup}
                    disabled={isLoading}
                >
                    <LinearGradient 
                        colors={['#D68D54', '#B25B28']} 
                        start={{x: 0, y: 0}} 
                        end={{x: 1, y: 0}}
                        style={styles.completeButtonGradient}
                    >
                        <Text style={styles.completeButtonText}>
                            {isLoading ? 'Creating account...' : 'Complete Signup'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Back</Text>
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
        minHeight: '100%',
    },
    headerContainer: {
        alignItems: 'center',
        marginVertical: 30,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
    },
    errorContainer: {
        backgroundColor: 'rgba(255, 87, 87, 0.2)',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 87, 87, 0.3)',
    },
    errorText: {
        color: '#FF5757',
        fontSize: 14,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
        marginTop: 20,
    },
    formSection: {
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 12,
        fontWeight: '500',
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateInputContainer: {
        flex: 1,
        marginHorizontal: 5,
    },
    dateLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        marginBottom: 4,
    },
    dateInput: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 12,
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    genderOption: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    genderOptionSelected: {
        backgroundColor: 'rgba(214, 141, 84, 0.3)',
        borderWidth: 1,
        borderColor: '#D68D54',
    },
    genderText: {
        color: 'white',
        marginTop: 5,
    },
    timezoneButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 15,
    },
    timezoneText: {
        color: 'white',
        fontSize: 16,
    },
    timezoneHint: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        marginTop: 4,
    },
    completeButton: {
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    completeButtonLoading: {
        opacity: 0.8,
    },
    completeButtonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    completeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        alignItems: 'center',
        padding: 16,
    },
    backButtonText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence, 
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

//const API_URL = 'http://10.0.2.2:3001'; // Android emulator special IP for localhost

/* my (jono) IP for localhost. I'm using an actual android device. 
  Not sure what's the appropriate solution for all devices to work. But this works for me*/
  const API_URL = 'http://192.168.1.104:3001'; 

export default function SignInScreen() {
    const params = useLocalSearchParams();
    const [email, setEmail] = useState(params.email?.toString() || '');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    
    // Animation values
    const logoScale = useSharedValue(1);
    const logoY = useSharedValue(0);
    
    useEffect(() => {
        // Check if user is already logged in
        checkExistingToken();
        
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

    // Check for existing authentication token
    const checkExistingToken = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            
            if (token && refreshToken) {
                // Validate token or navigate directly
                router.replace('/(drawer)/(tabs)');
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
        }
    };

    // Store authentication tokens
    const storeAuthTokens = async (token, refreshToken, userData) => {
        try {
            await AsyncStorage.setItem('authToken', token);
            await AsyncStorage.setItem('refreshToken', refreshToken);
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
        } catch (error) {
            console.error('Error storing authentication data:', error);
            Alert.alert('Error', 'Failed to save login information');
        }
    };

    // Clear error message whenever any input field changes
    const clearError = () => {
        if (errorMessage) {
            setErrorMessage('');
        }
    };

    const validateInputs = () => {
        if (!email.trim()) {
            setErrorMessage('Email is required');
            return false;
        }
        
        if (!password.trim()) {
            setErrorMessage('Password is required');
            return false;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Please enter a valid email address');
            return false;
        }
        
        setErrorMessage('');
        return true;
    };

    const handleSignIn = async () => {
        clearError();
        
        // Validate inputs
        if (!validateInputs()) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Make API call to backend login endpoint
            const response = await axios.post(`${API_URL}/api/login`, {
                email,
                password
            });
            
            // Store authentication data
            const { token, refreshToken, user } = response.data;
            await storeAuthTokens(token, refreshToken, user);
            
            // Navigate to main app
            router.replace('/(drawer)/(tabs)');
        } catch (error) {
            console.error('Login error:', error);
            
            // Handle different error scenarios
            if (error.response) {
                // The server responded with an error status
                const status = error.response.status;
                
                if (status === 401) {
                    setErrorMessage('Invalid email or password');
                } else if (status === 400) {
                    setErrorMessage(error.response.data?.error || 'Please check your inputs');
                } else {
                    setErrorMessage('Login failed. Please try again later.');
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
            
            <Text style={styles.appName}>Healthy</Text>
            
            <Text style={styles.tagline}>What you train today, you'll be stronger tomorrow</Text>
            
            <View style={styles.formContainer}>
                {errorMessage ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
                ) : null}
                
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                clearError();
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="example@email.com"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                        />
                        <Ionicons name="mail" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                    </View>
                </View>
                
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                clearError();
                            }}
                            secureTextEntry={secureTextEntry}
                            autoCapitalize="none"
                            placeholder="••••••••"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                        />
                        <TouchableOpacity 
                            onPress={() => setSecureTextEntry(!secureTextEntry)}
                            style={styles.inputIcon}
                        >
                            <Ionicons 
                                name={secureTextEntry ? "eye" : "eye-off"} 
                                size={20} 
                                color="rgba(255,255,255,0.7)" 
                            />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.forgotPasswordContainer}>
                        <TouchableOpacity>
                            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                <TouchableOpacity 
                    style={[styles.loginButton, isLoading && styles.loginButtonLoading]}
                    onPress={handleSignIn}
                    disabled={isLoading}
                >
                    <LinearGradient 
                        colors={['#D68D54', '#B25B28']} 
                        start={{x: 0, y: 0}} 
                        end={{x: 1, y: 0}}
                        style={styles.loginButtonGradient}
                    >
                        <Text style={styles.loginButtonText}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.createAccountButton}
                    onPress={() => router.push('/signup')}
                >
                    <Text style={styles.createAccountText}>Create account</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3A2A1F', // Dark brown background
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoBackground: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#D68D54',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 10,
    },
    logoImage: {
        width: 70,
        height: 70,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
        textAlign: 'center',
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginBottom: 40,
        marginHorizontal: 20,
    },
    formContainer: {
        width: '100%',
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
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 8,
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
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginTop: 8,
    },
    forgotPasswordText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
    },
    loginButton: {
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
    loginButtonLoading: {
        opacity: 0.8,
    },
    loginButtonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    createAccountButton: {
        alignItems: 'center',
        padding: 16,
    },
    createAccountText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
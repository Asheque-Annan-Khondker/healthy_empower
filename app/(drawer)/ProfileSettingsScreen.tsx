import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { API_URL } from '@/constants/DBAPI';
import axios from 'axios';
import { getCurrentUser } from '@/utils/authState';

const { height, width } = Dimensions.get('window');

const ProfileSettingsScreen = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [healthProfile, setHealthProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        initializeUserData();
    }, []);

    const initializeUserData = async () => {
        try {
            setLoading(true);
            
            // Get current user from AsyncStorage
            const user = await getCurrentUser();
            if (!user) {
                setError('No authenticated user found');
                router.replace('/signin');
                return;
            }
            
            setCurrentUser(user);
            
            // Get user ID from stored user data or fetch by email
            let userId = user.id;
            if (!userId) {
                const apiUrl = await API_URL();
                const userByEmailResponse = await axios.get(
                    `${apiUrl}/api/users/by-email?email=${encodeURIComponent(user.email)}`
                );
                userId = userByEmailResponse.data.id;
            }
            
            await fetchUserData(userId);
        } catch (err) {
            console.error('Error initializing user data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserData = async (userId) => {
        try {
            // Fetch user data first
            const apiUrl = await API_URL();
            const userResponse = await axios.get(`${apiUrl}/api/users/${userId}`);
            setUserData(userResponse.data);
            
            // Try to fetch health profile separately
            try {
                const healthResponse = await axios.get(`${apiUrl}/api/users/${userId}/health-profile`);
                setHealthProfile(healthResponse.data);
            } catch (healthErr) {
                if (healthErr.response?.status === 404) {
                    // Health profile doesn't exist, that's okay
                    setHealthProfile(null);
                } else {
                    throw healthErr;
                }
            }
        } catch (err) {
            throw err;
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Profile Details</Text>
                </View>
                <View style={styles.subContainer}>
                    <ActivityIndicator size="large" color="#D68D54" />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Profile Details</Text>
                </View>
                <View style={styles.subContainer}>
                    <Text style={styles.errorText}>Error: {error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={initializeUserData}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Profile Details</Text>
            </View>

            <View style={styles.subContainer}>
                <View style={styles.detailsContainer}>
                    <Text style={styles.sectionTitle}>User Information</Text>
                    {userData && (
                        <>
                            <View style={styles.dataRow}>
                                <Text style={styles.label}>Username:</Text>
                                <Text style={styles.value}>{userData.username}</Text>
                            </View>
                            <View style={styles.dataRow}>
                                <Text style={styles.label}>Email:</Text>
                                <Text style={styles.value}>{userData.email}</Text>
                            </View>
                        </>
                    )}
                    
                    <Text style={styles.sectionTitle}>Health Profile</Text>
                    {healthProfile ? (
                        <>
                            <View style={styles.dataRow}>
                                <Text style={styles.label}>Height:</Text>
                                <Text style={styles.value}>{healthProfile.height} cm</Text>
                            </View>
                            <View style={styles.dataRow}>
                                <Text style={styles.label}>Weight:</Text>
                                <Text style={styles.value}>{healthProfile.weight} kg</Text>
                            </View>
                            <View style={styles.dataRow}>
                                <Text style={styles.label}>Last Updated:</Text>
                                <Text style={styles.value}>{new Date(healthProfile.recorded_at).toLocaleDateString()}</Text>
                            </View>
                        </>
                    ) : (
                        <Text style={styles.noDataText}>No health profile data available</Text>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#FAF7F4',
        //padding: 10
    },
    subContainer: {
        flex: 1,
        padding: 15,
        backgroundColor: '#FAF7F4'
    },
    detailsContainer: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D68D54',
        marginTop: 15,
        marginBottom: 10,
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    label: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
        flex: 1,
    },
    value: {
        fontSize: 16,
        color: '#333',
        flex: 1,
        textAlign: 'right',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#FF6B6B',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#D68D54',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        alignSelf: 'center',
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noDataText: {
        fontStyle: 'italic',
        color: '#999',
        textAlign: 'center',
        marginTop: 10,
    },
    title: {
        fontSize: 25,
        fontWeight: 600
    },
    titleContainer: {
        padding: 20,
        backgroundColor: '#FAF7F4',
        alignItems: 'center'
    },
    header: {
        backgroundColor: '#D68D54',
        paddingTop: 70,
        paddingBottom: 15,
        paddingHorizontal: 16,
        top: height-930 // hardcoded this cos i couldnt figue univeral method
    },
    headerContentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    menuButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        flex: 1,
        marginLeft: 8,
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    balanceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    }
});

export default ProfileSettingsScreen;

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';

export const logout = async () => {
    try {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('userData'); 

        router.replace('/signin');
    } catch (error) {
        console.error("couldnt logout", error); 
        router.replace('/'); // even if error return to login screen
    }
}



export const isAuthenticated = async () => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        return !!token;
    } catch (error) {
        console.error("couldnt check auth", error); 
        return false; 
    }
}; 

export const getCurrentUser = async () => {
    try {
        const userData = await AsyncStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null; 
    } catch (error) {
        console.error('Error getting user data:', error);
        return null; 
    }
}

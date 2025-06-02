import React from 'react';
import { View, Text, StyleSheet, Button, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { API_URL } from '@/constants/DBAPI';
import axios from 'axios';

const { height, width } = Dimensions.get('window');

const ProfileSettingsScreen = () => {
    const navigation = useNavigation();

    const response = axios.get(`${API_URL}/api/users`);
    console.log(response);
    return (
        <SafeAreaView style={styles.container}>

            {/** Header  
            <View style={styles.header}>
                <View style={styles.headerContentContainer}>
                    <TouchableOpacity 
                    style={styles.menuButton}
                    onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                    >
                    <Ionicons name="menu" size={28} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile Settings</Text>
                    <View style={styles.balanceContainer}>
                        <Text style={styles.balanceText}>hi</Text>
                    </View>
                </View>
            </View>
            */}

            <View style={styles.titleContainer}>
                <Text style={styles.title}>Profile Details</Text>
            </View>

            {/** get user data and health profile
             * iterate thru user data api
             * iterate thru health profile api
             */}
            <View style={styles.subContainer}>
                <View style={styles.detailsContainer}>
                    <Text>First Name </Text>
                    <Text>Last Name </Text>
                    <Text>Email </Text>
                    <Text>Password </Text>
                </View>
            </View>
            
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'yellow',
        //padding: 10
    },
    subContainer: {
        flex: 1,
        padding: 15,
        backgroundColor: 'grey'
    },
    detailsContainer: {
        padding: 20,
        backgroundColor: 'green',
        borderRadius: 15
    },
    title: {
        fontSize: 25,
        fontWeight: 600
    },
    titleContainer: {
        padding: 20,
        backgroundColor: "pink",
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
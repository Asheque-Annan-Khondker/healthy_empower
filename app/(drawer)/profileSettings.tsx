import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import ProfileSettingsScreen from '@/app/(drawer)/ProfileSettingsScreen';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ProfileSettings() {
    console.log("Profile Settings")
    return (
        <SafeAreaProvider style={styles.container}>
            <ProfileSettingsScreen/>
        </SafeAreaProvider>
    );
}



const styles = StyleSheet.create({
    container: {
        //flex: 1,
        backgroundColor: 'blue',
    }
});
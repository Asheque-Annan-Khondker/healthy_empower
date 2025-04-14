import React from 'react';
import ProfileDetailsScreen from '../components/auth/ProfileDetailsScreen'; // Adjust the path as needed
import { View } from 'react-native';

export default function ProfileDetailsPage() {
    return (
        <View style={{ flex: 1 }}>
            <ProfileDetailsScreen />
        </View>
    );
}
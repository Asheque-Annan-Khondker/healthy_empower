import React from 'react';
import SignInScreen from '@/components/auth/SignIn';
import { View, Text } from 'react-native';

export default function SignInPage() {
    return (
        <View style={{ flex: 1}}>
            <SignInScreen />; 
        </View>
    );
}
import React from 'react';
import SignUpScreen from '@/components/auth/SignUp';
import { View } from 'react-native'; 

export default function SignUpPage() {
    return (
        <View style={{flex: 1}}>
            <SignUpScreen></SignUpScreen>
        </View>
    )
}
import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';

const q1 = ['Never', '1-2 Days', '3-5 Days', 'More than 5 days'];
const q2 = ['0-30 mins', '30-60 mins', '60-90 mins', 'More than 90mins'];
const q3 = ['No, I eat whatever I feel like without much thought',
            'No, I don\'t but I eat healthy',
            'Yes, I count calories but I don\'t consume any supplements',
            'Yes, I count calories and consume fitness food supplements' ];
const q4 = ['Cardio', 'Interval Training', 'Bodybuilding', 'Powerlifting'];
const q5 = ['Stay fit', 'Maintain weight', 'Build Muscles', 'Lose weight', , 'Gain weight', ];

export default function FitnessForm() {
    const [q1Selected, setQ1Selected] = useState(null);
    const [q2Selected, setQ2Selected] = useState(null);
    const [q3Selected, setQ3Selected] = useState(null);
    const [q4Selected, setQ4Selected] = useState(null);
    const [q5Selected, setQ5Selected] = useState(null);

    // form answers
    const handleSubmit = () => {
        const answers = [q1Selected, q2Selected, q3Selected, q4Selected, q5Selected];

        // write conditional logic to direct to a start-up guide based on answers
        // question answers are in order from easy to hardest
        
        let first = q1.findIndex(item => item === q1Selected)
        let second = q2.findIndex(item => item === q2Selected)
        let third = q3.findIndex(item => item === q3Selected)

        const sum = first+second+third;
        if (sum <= 3) {
            //redirect to start-up guides if possible
            Alert.alert("We recommend you start on our Beginner Start-Up Guide")
            router.back();
        } else if (sum > 3 && sum <= 6) {
            Alert.alert("We recommend you start on our Intermediate Start-Up Guide")
            router.back();
        } else {
            Alert.alert("We recommend you start on our Expert Start-Up Guide")
            router.back();
        }
    
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Fitness Assessment</Text>
                <Text style={styles.formSubtitle}>Help us understand your fitness goals and habits</Text>

                <View style={styles.questionSection}>
                    <Text style={styles.question}>How often do you exercise?</Text>
                    <View style={styles.radioGroup}>
                        {q1.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.radioContainer}
                            onPress={() => setQ1Selected(option)}
                        >
                            <View style={[styles.radioCircle, q1Selected === option && styles.selected]}>
                                {q1Selected === option && <View style={styles.innerCircle} />}
                            </View>
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.questionSection}>
                    <Text style={styles.question}>How much time do you spend on a regular exercise?</Text>
                    <View style={styles.radioGroup}>
                        {q2.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.radioContainer}
                            onPress={() => setQ2Selected(option)}
                        >
                            <View style={[styles.radioCircle, q2Selected === option && styles.selected]}>
                                {q2Selected === option && <View style={styles.innerCircle} />}
                            </View>
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.questionSection}>
                    <Text style={styles.question}>What type of exercises do you prefer?</Text>
                    <View style={styles.radioGroup}>
                        {q3.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.radioContainer}
                            onPress={() => setQ3Selected(option)}
                        >
                            <View style={[styles.radioCircle, q3Selected === option && styles.selected]}>
                                {q3Selected === option && <View style={styles.innerCircle} />}
                            </View>
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.questionSection}>
                    <Text style={styles.question}>What are your main goals for exercising?</Text>
                    <View style={styles.radioGroup}>
                        {q4.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.radioContainer}
                            onPress={() => setQ4Selected(option)}
                        >
                            <View style={[styles.radioCircle, q4Selected === option && styles.selected]}>
                                {q4Selected === option && <View style={styles.innerCircle} />}
                            </View>
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.questionSection}>
                    <Text style={styles.question}>Do you have a nutrition plan?</Text>
                    <View style={styles.radioGroup}>
                        {q5.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.radioContainer}
                            onPress={() => setQ5Selected(option)}
                        >
                            <View style={[styles.radioCircle, q5Selected === option && styles.selected]}>
                                {q5Selected === option && <View style={styles.innerCircle} />}
                            </View>
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                        ))}
                    </View>
                </View>
                
                <TouchableOpacity 
                    style={styles.submitButton} 
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FAF7F4', // Light warm background from login screen
        padding: 0,
    },
    formContainer: {
        padding: 20,
    },
    formTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#3A2A1F', // Dark brown from login screen
        textAlign: 'center',
        marginBottom: 8,
    },
    formSubtitle: {
        fontSize: 16,
        color: '#9B8579', // Warm gray
        textAlign: 'center',
        marginBottom: 30,
    },
    questionSection: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#3A2A1F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    question: {
        fontSize: 18,
        fontWeight: '600',
        color: '#3A2A1F', // Dark brown from login screen
        marginBottom: 16,
    },
    radioGroup: {
        paddingLeft: 8,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    radioCircle: {
        height: 22,
        width: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#B25B28', // Darker brand color
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    innerCircle: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#D68D54', // Primary brand color
    },
    selected: {
        borderColor: '#D68D54', // Primary brand color
    },
    optionText: {
        fontSize: 16,
        color: '#3A2A1F', // Dark brown
    },
    submitButton: {
        backgroundColor: '#D68D54', // Primary brand color
        paddingVertical: 16,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 30,
        shadowColor: '#B25B28',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
});
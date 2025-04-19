import React, { useState, Component } from 'react';
import { Button, View, ScrollView, Alert, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

const q1 = ['Never', '1-2 Days', '3-5 Days', 'More than 5 days']; {/* Never, 1-2 days, 3-5 days, more than 5 days */}
const q2 = ['0-30 mins', '30-60 mins', '60-90 mins', 'More than 90mins'];
const q3 = ['Cardio', 'Bodybuilding', 'Powerlifting', 'Interval Training'];
const q4 = ['Build Muscles', 'Lose weight', 'Stay fit', 'Gain weight', 'Maintain weight'];
const q5 = ['Yes, I count calories and consume fitness food supplements', 
            'Yes, I count calories but I don\'t consume any supplements', 
            'No, I don\'t but I eat healthy',
            'No, I eat whatever I feel like without much thought'
           ];

export default function FitnessForm() {

    const [q1Selected, setQ1Selected] = useState(null);
    const [q2Selected, setQ2Selected] = useState(null);
    const [q3Selected, setQ3Selected] = useState(null);
    const [q4Selected, setQ4Selected] = useState(null);
    const [q5Selected, setQ5Selected] = useState(null);

    // Need to implement GET/POST requests
    const handleSubmit = () => {
        console.log('Selected options:\nHow often do you exercise? ', 
            q1Selected, '\nHow much time do you spend on a regular exercise? ', 
            q2Selected, '\nWhat type of exercises do you prefer to do?',
            q3Selected, '\nWhat are your main goals for exercising?',
            q4Selected, '\nDo you have a nutrition plan?',
            q5Selected
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.container}>
        
                <Text style={{fontWeight: 600, fontSize: 30, alignItems: 'center'}}>Fitness Form</Text>

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
                        <Text>{option}</Text>
                    </TouchableOpacity>
                    ))}
                </View>
                

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
                        <Text>{option}</Text>
                    </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.question}>How often do you exercise?</Text>
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
                        <Text>{option}</Text>
                    </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.question}>How often do you exercise?</Text>
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
                        <Text>{option}</Text>
                    </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.question}>Do you have a nutrition plan?</Text>
                <View style={styles.q5View}>
                  {q5.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.radioContainer}
                        onPress={() => setQ5Selected(option)}
                    >
                        <View style={[styles.radioCircle, q5Selected === option && styles.selected]}>
                            {q5Selected === option && <View style={styles.innerCircle} />}
                        </View>
                        <Text>{option}</Text>
                    </TouchableOpacity>
                  ))}  
                </View>
                
                
                <Button title="Submit" onPress={handleSubmit} />
        
            </View>
        </ScrollView>
        
        
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: 'white',
        //flex: 1,
        //alignItems: 'center'
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#444',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    radioGroup: {
        //flexDirection: 'row',
        //flexWrap: 'wrap', // allows wrapping if too many to fit in one row
        justifyContent: 'center',
        marginBottom: 20,
    },
    innerCircle: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#444',
    },
    selected: {
        borderColor: '#007AFF',
    },
    q5View: {
        paddingRight: 20
    },
    question: {
        paddingVertical: 10,
        fontSize: 18
    }
})
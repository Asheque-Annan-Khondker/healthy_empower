import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Alert, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';
import FitnessForm from '@/app/FitnessForm';

/** NEED TO IMPLEMENT:
    - android 'back' function
    - more intuitive touchscreen functionalities 
        e.g touch sides to exit modal or something like that
    - check if iphone back swipe functionality works. (I'm using android so idk)
    - GET/POST request with forms
    - styling 
    - modal animations 
    
    **/

const ModalFitnessForm = () => {

    // First modal is dialog box, confirming if user wants to proceed with FitnessForm
    // Second nested modal is wrapper for FitnessForm
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };
    const toggleFormModal = () => {
        setIsFormVisible(!isFormVisible);
    };

    return (
        <View>
            <Button title="Start" onPress={toggleModal} />
            <Modal isVisible={isModalVisible}>

                <View style={styles.container}>

                    <View>
                        <Text style={styles.title}>You are about to start the quiz</Text>
                        <Text style={styles.description}>Are you sure?</Text>

                        <View style={styles.buttonContainer}>
                            <View style={styles.buttonWrapper}>
                                <Button title="Let's do it!" onPress={toggleFormModal} />
                            </View>
                            <View style={styles.buttonWrapper}>
                                <Button title="Uh, no thanks" onPress={toggleModal} />
                            </View>
                        </View>
                        
                    </View>
                    
                    <Modal isVisible={isFormVisible} >
                        <FitnessForm />
                        <Button title="Nevermind" onPress={toggleFormModal} />
                    </Modal>

                </View>
    
            </Modal>
        </View>
    )
}
// NEED TO DO STYLING. needs to be consistent with the rest of the app
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 16,
        //border...Radius is curves
        borderTopRightRadius: 30, // topRight
        borderTopLeftRadius: 30, //topLeft
        borderBottomLeftRadius: 30, //bottomLeft
        borderBottomRightRadius: 30 //bottomRight
    },
    buttonContainer: {
        //padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonWrapper: {
        paddingHorizontal: 10
    },
    title: {
        fontWeight: 500,
        fontSize: 18,
        //paddingTop: 8
    },
    description: {
        fontWeight: 400,
        fontSize: 16,
        paddingVertical: 10,
        //lineHeight: 20,
        textAlign: 'center'
    }
});
export default ModalFitnessForm;
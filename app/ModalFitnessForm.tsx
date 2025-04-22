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
                        <Text> welcome to healthy empower yadayada, fill our form to see where you are</Text>
                        <Button title="Sure" onPress={toggleFormModal} />
                        <Button title="No, Thanks" onPress={toggleModal} />
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
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignItems: 'center'
    }
});
export default ModalFitnessForm;
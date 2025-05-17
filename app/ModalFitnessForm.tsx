import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import FitnessForm from '@/app/FitnessForm';
import { IonIcon } from '@/utils/getIcon';
import { Ionicons } from '@expo/vector-icons';

/** 
 * NEED TO IMPLEMENT:
 * - android 'back' function
 * - more intuitive touchscreen functionalities
 * e.g touch sides to exit modal or something like that
 * - check if iphone back swipe functionality works. (I'm using android so idk)
 * - GET/POST request with forms
 * - styling
 * - modal animations
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
    <View style={styles.buttonContainer}>
      {/* Restyled Start button to match login screen colors */}
      <TouchableOpacity 
        style={styles.startButton} 
        onPress={toggleModal}
      >
        <Text style={styles.startButtonText}>Find Workouts!</Text>
      </TouchableOpacity>
      
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Welcome to Healthy Empower!</Text>
          <Text style={styles.modalText}>Fill out our form to see where you are in your fitness journey.</Text>
          
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={toggleFormModal}
            >
              <Text style={styles.modalButtonText}>Sure</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={toggleModal}
            >
              <Text style={styles.modalButtonText}>No, Thanks</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Modal isVisible={isFormVisible}>
          <View style={styles.formContainer}>
            <FitnessForm />
            <TouchableOpacity 
              style={[styles.modalButton, styles.exitButton]} 
              onPress={toggleFormModal}
            >
              <Text style={styles.exitButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  startButton: {
    backgroundColor: '#D68D54', // Primary brand color from login screen
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#B25B28',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: '80%', // Set a width that works well with your layout
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#9B8579',
    textAlign: 'center',
    marginBottom: 24,
    marginLeft: 4,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: '#D68D54',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  exitButton: {
    backgroundColor: '#D68D54', // Primary brand color
    paddingVertical: 13,
    borderRadius: 10, // No rounded corners for bottom button
    marginTop: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0, // Make it span the full width
    elevation: 5, // Higher elevation to stand out
},
exitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 1,
},
  cancelButton: {
    backgroundColor: 'rgba(214, 141, 84, 0.2)',
  },
  backButton: {
    backgroundColor: '#B25B28',
    marginTop: 16,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 16,
    maxHeight: '90%',
  },
});

export default ModalFitnessForm;
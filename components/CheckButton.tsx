import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CheckboxButton = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.checkboxContainer, { backgroundColor: isChecked ? '#8465c2' : '#e0e0e0' }]}
      onPress={() => setIsChecked(!isChecked)}
    >
      {isChecked && <Ionicons name="checkmark" size={18} color="white" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
});

export default CheckboxButton;

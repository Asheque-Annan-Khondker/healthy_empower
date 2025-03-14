import React, { useState } from 'react';
import { Switch, StyleSheet } from 'react-native';

const ToggleButton = () => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  return (
    <Switch
      value={isSwitchOn}
      onValueChange={() => setIsSwitchOn(!isSwitchOn)}
      trackColor={{ false: '#e0e0e0', true: '#8465c2' }}
      thumbColor={'#ffffff'}
      style={styles.toggleSwitch}
    />
  );
};

const styles = StyleSheet.create({
  toggleSwitch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
});

export default ToggleButton;

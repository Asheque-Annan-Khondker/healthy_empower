import React, { useState } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

const SlidingToggleButton: React.FC = () => {
  const [isOn, setIsOn] = useState(false);
  const translateX = useSharedValue(5); //starting position

  const toggleSwitch = () => {
    setIsOn(!isOn);
    translateX.value = isOn ? 5 : 45; //toggles slider left or right
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(translateX.value, { duration: 250 }) }],
  }));

  return (
    <View style={styles.container}>
      {/*toggle button*/}
      <Pressable style={[styles.toggleContainer, isOn ? styles.on : styles.off]} onPress={toggleSwitch}>
        <Animated.View style={[styles.slider, animatedStyle]} />
      </Pressable>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  toggleContainer: {
    width: 84,
    height: 34,
    borderRadius: 22,
    backgroundColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    position: "relative",
    elevation: 5, //shadow
    shadowColor: "#000", //ios shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  slider: {
    width: 24,
    height: 24,
    borderRadius: 17,
    backgroundColor: "white",
    position: "absolute",
    left: 5,
    elevation: 3, //shadow
    shadowColor: "#000", //ios shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  label: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  onText: {
    color: "#27AE60", //green for On
  },
  offText: {
    color: "#E74C3C", //red for Off
  },
  on: {
    backgroundColor: "#A3E4D7", //light green
  },
  off: {
    backgroundColor: "#F5B7B1", //light red
  },
});

export default SlidingToggleButton;

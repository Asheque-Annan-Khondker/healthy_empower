import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Menu, Button } from "react-native-paper";
import { useRouter } from "expo-router";

const DropdownMenu = () => {
  const [visible, setVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Select an option");
  const router = useRouter();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelect = (option, link) => {
    setSelectedOption(option);
    closeMenu();
    router.push(link); // Redirects to the selected page
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Button mode="contained" onPress={openMenu}>{selectedOption}</Button>}
      >
        <Menu.Item onPress={() => handleSelect("Beginner", "/(drawer)/(guide)/BeginnerGuide")} title="Beginner" />
        <Menu.Item onPress={() => handleSelect("Intermediate", "/(drawer)/(guide)/IntermediateGuide")} title="Intermediate" />
        <Menu.Item onPress={() => handleSelect("Expert", "/(drawer)/(guide)/ExpertGuide")} title="Expert" />

      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    alignSelf: "center",
  },
});

export default DropdownMenu;

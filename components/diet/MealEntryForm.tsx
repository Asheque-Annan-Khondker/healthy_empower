import {Chip, Modal, TextInput, Text, Button, Portal, Title} from 'react-native-paper'
import {useState} from "react";
import {View, StyleSheet} from "react-native";


const MealEntryForm = ({visibility, onDismiss}) => {
    // use the inputter from paper
    return (
        <Portal>
        <Modal
            visible={visibility}
            onDismiss={onDismiss}
            contentContainerStyle={styles.container}
            >
            <Title>Modal Title</Title>
            <TextInput placeholder='Enter Meal Entry'/>
            <Text>Category</Text>
            <View style={{flexDirection: "row", flexShrink: 1}} >
            <Chip style={styles.chip} icon="information" onPress={() => console.log('Pressed')}>Breakfast</Chip>
            <Chip style={styles.chip} icon="information" onPress={() => console.log('Pressed')}>Lunch</Chip>
            <Chip style={styles.chip} icon="information" onPress={() => console.log('Pressed')}>Dinner</Chip>

            </View>
            <Button style={styles.Button} mode={"contained"} onPress={() => onDismiss()} title="Dismiss">Dismiss</Button>
            <Button style={styles.Button} onPress={() => onDismiss()} title="Save">Save</Button>
        </Modal>
        </Portal>
    )
}

export default MealEntryForm

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        margin: 10,
        padding: "auto"

    },
    chip: {
        width: 120,
        marginLeft: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    Button: {

    }
})
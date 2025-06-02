import {Chip, TextInput, Text, Button, Title} from 'react-native-paper'
import BottomSheet from "@gorhom/bottom-sheet";
import {useCallback, useRef, useState} from "react";
import {View, StyleSheet} from "react-native";
import {MealLog} from "@/utils/table.types";
import {MealLogDBModal} from "@/utils/dbFunctions";
import React from 'react';


const MealEntryForm = ({visibility, onDismiss}) => {
    const bottomSheetRef = useRef<BottomSheet>(null)
    const snapPoints = ['25%', '50%'];
    // use the inputter from paper
    const [mealEntry, setMealEntry] = useState<Partial<MealLog>>({
        food_id: '',
        mealType: '',
        description: '',
    });
    const submitMealEntry = async () => {
        await MealLogDBModal.create(mealEntry)
    }
    const handleInputChange = (field: keyof MealLog, value: any) =>{
        setMealEntry({
            ...mealEntry,
            [field]: value
        })
    }
    const handleSheetClose = useCallback(()=>{
        bottomSheetRef.current?.close()
        onDismiss()
    },[onDismiss])
    return (
            <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            index={1}
            enablePanDownToClose
            onClose={handleSheetClose}>
                <Title style={styles.title}>Add Meal</Title>

    <TextInput
        placeholder='Enter Meal Entry'
        value={mealEntry.description}
        onChangeText={text => handleInputChange('description', text)}
    />

    <Text style={styles.label}>Category</Text>
    <View style={styles.chipContainer}>
        <Chip
            style={styles.chip}
            selected={mealEntry.mealType === 'Breakfast'}
            onPress={() => handleInputChange('mealType', 'Breakfast')}
        >
            Breakfast
        </Chip>
        <Chip
            style={styles.chip}
            selected={mealEntry.mealType === 'Lunch'}
            onPress={() => handleInputChange('mealType', 'Lunch')}
        >
            Lunch
        </Chip>
        <Chip
            style={styles.chip}
            selected={mealEntry.mealType === 'Dinner'}
            onPress={() => handleInputChange('mealType', 'Dinner')}
        >
            Dinner
        </Chip>
    </View>

    <View style={styles.buttonContainer}>
        <Button style={styles.button} onPress={handleSheetClose}>Cancel</Button>
        <Button
            style={styles.button}
            mode="contained"
            onPress={submitMealEntry}
        >
            Save
        </Button>
    </View>
</BottomSheet>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        marginBottom: 16,
    },
    label: {
        marginTop: 16,
        marginBottom: 8,
    },
    chipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
    },
    button: {
        minWidth: 100,
    }
});

export default MealEntryForm
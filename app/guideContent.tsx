
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { Exercise } from '@/utils/table.types';
import { Button } from 'react-native-paper';
import {router} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";

const { height } = Dimensions.get('window');

export default function GuideContent({ work_id }: { work_id: number }) {
    const [exerciseArray, setExerciseArray] = useState<Exercise[]>(exampleExercises);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const renderNavButtons = () =>{
        if(currentPage == 0){
            return (
                <View style={styles.buttonBox}>
                    <Button
                        mode="contained"
                        onPress={() => {
                            handleDotPress(currentPage+1)
                        }}
                        style={styles.button}
                        >Begin</Button>
                </View>
            )

        }
        else if (currentPage == exerciseArray.length-1){
            return (
                <View style={styles.buttonBox}>
                    <Button
                        mode="contained"
                        onPress={() => {
                            console.log('Finished');
                            router.push('/(drawer)/(guide)/guideSelection')
                        }}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                        >Finish</Button>
                </View>
            )}
        //  else {
        //     return (
        //         <View style={styles.buttonBox}>
        //             <Button
        //                 mode="contained"
        //                 onPress={() => {
        //                     handleDotPress(currentPage-1)
        //                 }}
        //                 style={styles.button}
        //                 contentStyle={styles.buttonContent}
        //                 >Back</Button>
        //             <Button
        //                 mode="contained"
        //                 onPress={() => {
        //                     handleDotPress(currentPage+1)
        //                 }}
        //                 style={styles.button}
        //                 contentStyle={styles.buttonContent}
        //                 >Next</Button>
        //         </View>
        //     )
        // }
    }
    const handleDotPress = (index: number) => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
        // setCurrentPage(index);
    };

    const renderIndicator = () => (
        <View style={styles.indicatorContainer}>
            {exerciseArray.map((_, index) => {
                const scale = scrollX.interpolate({
                    inputRange: [
                        (index - 1) * height,
                        index * height,
                        (index + 1) * height,
                    ],
                    outputRange: [0.8, 1.4, 0.8],
                    extrapolate: 'clamp',
                });

                const opacity = scrollX.interpolate({
                    inputRange: [
                        (index - 1) * height,
                        index * height,
                        (index + 1) * height,
                    ],
                    outputRange: [0.5, 1, 0.5],
                    extrapolate: 'clamp',
                });

                return (
                    <TouchableOpacity key={index} onPress={() => handleDotPress(index)}>
                        <Animated.View
                            style={[
                                styles.indicatorDot,
                                { transform: [{ scale }], opacity },
                            ]}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={exerciseArray}
                keyExtractor={(item) => item.exercise_id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.exerciseCard}>
                        <Text style={styles.exerciseTitle}>{item.name}</Text>
                        <Text style={styles.exerciseDescription}>{item.description}</Text>
                    </View>
                )}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onMomentumScrollEnd={event => {
                    const offsetY = event.nativeEvent.contentOffset.y
                    const page = Math.round(offsetY/height)
                    setCurrentPage(page)
                }}
            />
            {renderIndicator()}
            {renderNavButtons()}
        </SafeAreaView>
    );
}

const exampleExercises: Exercise[] = [
    {
        exercise_id: 1,
        name: "Push-Up",
        description: "A basic upper body exercise that targets the chest, shoulders, and triceps.",
        type: "Bodyweight",
        measurementType: "Reps",
        difficulty_level: "Beginner",
        target_muscle_group: "Chest",
    },
    {
        exercise_id: 2,
        name: "Squat",
        description: "A lower body exercise that targets the quadriceps, hamstrings, and glutes.",
        type: "Bodyweight",
        measurementType: "Reps",
        difficulty_level: "Beginner",
        target_muscle_group: "Legs",
    },
    {
        exercise_id: 3,
        name: "Deadlift",
        description: "A compound movement that targets the back, glutes, and hamstrings.",
        type: "Weightlifting",
        measurementType: "Weight",
        difficulty_level: "Intermediate",
        target_muscle_group: "Back",
    },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    exerciseCard: {
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    exerciseTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    exerciseDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    indicatorContainer: {
        position: 'absolute',
        right: 20,
        top: height / 2 - 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicatorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#2196f3',
        marginVertical: 8,
    },
    buttonBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 32,
        paddingHorizontal: 32,
        gap: 16,
    },
    buttonBoxSingle: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
        paddingHorizontal: 32,
    },
    button: {
        flex: 1,
        marginHorizontal: 0,
        borderRadius: 24,
        elevation: 2,
    },
    buttonContent: {
        height: 48,
    },
});
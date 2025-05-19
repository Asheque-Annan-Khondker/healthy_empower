import React from 'react';
import {useCallback, useRef} from 'react';
import { useState, useEffect } from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import { WorkoutPlan } from '@/utils/table.types';
import { WorkoutPlanDBModal } from '@/utils/dbFunctions';
import {router, useFocusEffect} from "expo-router";
import { Button } from 'react-native-paper';
import PlaceCard from "@/components/PlaceCard";
import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GuideSelection() {
  const [guideList, setGuideList] = useState<WorkoutPlan[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<WorkoutPlan | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  async function fetchData(){
    const response = await WorkoutPlanDBModal.get({
      plan_id: {eq: 2}
    });
    setGuideList(response);
  }


    const renderModal = () => (
        <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedGuide?.name}</Text>
            <Text style={styles.modalDescription}>{selectedGuide?.description}</Text>
            <Text style={styles.modalDifficulty}>Difficulty: {selectedGuide?.difficulty}</Text>
            <Text style={styles.modalStepsTitle}>Steps:</Text>
            {/*<ScrollView style={styles.stepsContainer}>*/}
            {/*    {guideList?.exercises.map((exercise, index) => (*/}
            {/*        <Text key={index} style={styles.stepText}>*/}
            {/*            Step {index + 1}: {exercise.name}*/}
            {/*        </Text>*/}
            {/*    ))}*/}
            {/*</ScrollView>*/}
            <View style={styles.modalButtons}>
                <Button style={styles.button} mode="contained" onPress={handleStartButton}>
                    Start
                </Button>
                <Button style={styles.button} mode="contained" onPress={handleSaveButton}>
                    Save
                </Button>
            </View>
        </View>
    );




    useFocusEffect(
      useCallback(() => {
        fetchData()
        return () =>{
          console.log("Refreshing Achievements")
        }
      }, [])
  )

  useEffect(()=>{
    console.log("Guide List", guideList);
  }, [guideList])
    const bottomSheetRef = useRef<BottomSheet>(null)
  // I only need the workout plan id
  const handleGuideSelect = (guide: WorkoutPlan) => {
    // show a modal page for brief description then user presses the start button
    // in the modal which navigates to the guide content page.
    setSelectedGuide(guide);
    bottomSheetRef.current?.snapToIndex(1);
    // alert(`set guide ${guide.name}`);
  }
  const handleStartButton = () => {
    // navigate to the guide content page
    // navigation.navigate('GuideContent', {workoutPlanId: selectedGuide?.plan_id});
    bottomSheetRef.current?.close();
    router.push({pathname: '/guideContent', params: {work_id: selectedGuide?.plan_id}});
  }
  const handleSaveButton = () =>{
    //TODO: save the selected guide to the database
  }

 const handleSheetChanges = useCallback((index: number)=>{
     console.log(`SheetChanges: ${index}`);
 }, [])
  return (
   <SafeAreaView style={{flex: 1}}>
      <GestureHandlerRootView style={styles.container}>
        <Text>Guide Selection</Text>
        <Text>Selected Guide: {selectedGuide?.name}</Text>
        <ScrollView style={{flex:1}} >
          {guideList.map((guide) => (
              <TouchableOpacity onPress={()=>{handleGuideSelect(guide)}}>
            <View key={guide.plan_id}>
                <PlaceCard title={guide.name}
                           subtext={guide.description}
                           leftBottomText={"Placeholder for duration"}
                           tag={guide.difficulty} image={''}/>
            </View>
              </TouchableOpacity>
          ))}
        </ScrollView>
        <Text>Hi?</Text>
        <BottomSheet ref={bottomSheetRef}
                     onChange={handleSheetChanges}
                     index={-1} 
                      snapPoints={['10%', '50%', '90%']}
                      enablePanDownToClose={true}
                      enableContentPanningGesture={true}
        >

           <BottomSheetView style={styles.contentContainer}>
            {renderModal()}
           </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>

   </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    modalDescription: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    modalDifficulty: {
        fontSize: 14,
        color: '#888',
        marginBottom: 16,
    },
    modalStepsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    stepsContainer: {
        maxHeight: 200,
        marginBottom: 16,
    },
    stepText: {
        fontSize: 14,
        color: '#444',
        marginBottom: 4,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        margin: 10,
        flex: 1,
    },
});

import {View} from "react-native";
import {FAB, List, Portal} from "react-native-paper";
import {FAIcon} from "@/utils/getIcon";
import {useCallback, useState} from "react";
import MealEntryForm from "@/components/diet/MealEntryForm";
import {FoodDBModal} from "@/utils/dbFunctions";
import {Food} from "@/utils/table.types";
import {useFocusEffect} from "expo-router";
import React from "react";
import GuideScreen from "@/components/guides/GuideDetail";
import CustomPaperList from "@/components/CustomPaperList";

export default function DietScreen() {
    const [state, setState] = useState( {open: false})
    const [list, setList] = useState<Food[]>([]);
    const onStageChange = ({open}) =>setState({open: open})

    const [modalVisible, setModalVisible] = useState<boolean>(false)
    async function getData() {
        let res = await FoodDBModal.getAll()
        setList(res)
    }
   // Screen focus refresh
    useFocusEffect(
        useCallback(()=>{
            getData()
            return ()=>console.log("refreshing list")
        },[])
    )

    const {open} = state
    // action should have an onpress that shows the modal
    return(
        <View>
            <Portal>
                <MealEntryForm onDismiss={()=>setModalVisible(false)} visibility={modalVisible} />
            <FAB.Group   actions={[
                { icon: 'plus', onPress: () => console.log('Pressed add') },
                {
                    icon: 'pen',
                    label: 'Write',
                    onPress: () => setModalVisible(true),
                },
                {
                    icon: 'camera',
                    label: 'Photo',
                    onPress: () => console.log('Pressed email'),
                },
                {
                    icon: 'bell',
                    label: 'Remind',
                    onPress: () => console.log('Pressed notifications'),
                },
            ]} icon={()=><FAIcon name={"key"} color={"white"}/>}  onStateChange={onStageChange} visible={true} open={open}/>
            </Portal>
            <GuideScreen/>
            <CustomPaperList title="Custom PaperList" content={list}/>
        </View>
    )
}

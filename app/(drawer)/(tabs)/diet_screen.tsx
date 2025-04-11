import CalorieDashboard from "@/components/diet/CalorieDashboard";
import {Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {FAB, Portal} from "react-native-paper";
import {FAIcon} from "@/utils/getIcon";
import {useState} from "react";
import {Entitlements} from "@expo/config-plugins/build/ios";
import MealEntryForm from "@/components/diet/MealEntryForm";

export default function DietScreen() {
    const [state, setState] = useState( {open: false})
    const onStageChange = ({open}) =>setState({open: open})

    const [modalVisible, setModalVisible] = useState<boolean>(false)


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
        </View>
    )
}

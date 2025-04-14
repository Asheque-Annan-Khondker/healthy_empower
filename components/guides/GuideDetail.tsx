import React, {useState} from "react";
import {Modal, Pressable, Text} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";


const GuideScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);


    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Modal animationType={"slide"} transparent={true} visible={false}
                        onRequestClose={() => setModalVisible(false)}
                       >
                    <Text>Bombastica</Text>
                </Modal>
                <Pressable onPress={() => setModalVisible(true)}>
                    <Text>Open</Text>
                </Pressable>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default GuideScreen
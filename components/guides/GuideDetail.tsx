import React, {useState} from "react";
import {Modal, Pressable, StyleSheet, Text, View} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {Button, Title} from "react-native-paper";
import {Exercise} from "@/utils/table.types";

const GuideScreen = (content: Exercise) => {
    const [modalVisible, setModalVisible] = useState(false);


    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Modal animationType={"slide"} transparent={true} visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                       >
                    {/*Make three sections*/}
                    <View>

                        <Title>Guide: {content.name}</Title>
                    </View>
                    <View style={styles.imgContainer}>
                        {/*<img src/>*/}
                    </View>
                    <View>
                        <Text> {content.description}</Text>
                    </View>
                    <View> 
                      {/*Dive can make components line up horizontally*/}

                      <div> 
                        <Button>
                          Start
                        </Button>
                        <Button>
                          Save
                        </Button>
                      </div>
                    </View>
                </Modal>
                <Pressable onPress={() => setModalVisible(true)}>
                    <Text>Open</Text>
                </Pressable>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default GuideScreen


const styles = StyleSheet.create({
    headerContainer: {},
    imgContainer: {},
    contentContainer: {}
})

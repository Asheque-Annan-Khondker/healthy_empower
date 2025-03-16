// Tip: Mat UI is incompatible
import {Dimensions, ImageSourcePropType, Pressable, StyleSheet, Text, View} from "react-native";
import React from "react";
import {Image} from "expo-image";
import Animated, {useAnimatedScrollHandler, useSharedValue} from "react-native-reanimated"
import {RouteParamInput, router} from "expo-router";

const screenHeight: number = Dimensions.get("screen").height
const screenWidth: number = Dimensions.get("screen").width;


type GuideCardProps = {
    img: ImageSourcePropType;
    title: string
    description: string
    link: string
}
function GuideCard(img:ImageSourcePropType, title: string, description: string, link) {
    const onPress =( () =>{
        // Navigate to link
       return  router.navigate(link)
    })
    return(
        <Pressable onPress={onPress}>
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    <Image source={img} style={styles.img}/>
                    <Text style={styles.title} >{title}</Text>
                    <Text style={styles.text}>{description}</Text>
                </View>
            </View>
        </Pressable>

    )
}


type  CardListProps = {
    cards: GuideCardProps[];
    horizontal: boolean
}
// Implement scrollable list of cards
const GuideCardList: React.FC<CardListProps> = ({cards, horizontal=true}) => {
    const offset = useSharedValue(16)
    const scrollHandler = useAnimatedScrollHandler(
        {
            onScroll:(event)=>{
                offset.value = event.contentOffset.x
            }
        }
    )
    return (
        // use flatlist for many list items
        <Animated.FlatList
            renderItem={({ item}) => {
                return GuideCard(item.img, item.title, item.description, item.link)
            }}
            scrollEnabled={true}
            style={styles.cardContainer}
            data={cards}
            pagingEnabled={true}
            scrollEventThrottle={16}
            onScroll={scrollHandler}
            horizontal={horizontal}
        ></Animated.FlatList>
            )


}

export default GuideCardList;
export {GuideCard}
const styles = StyleSheet.create({
        cardContainer: {
           // justifyContent: "center",
            padding: 10,
            margin: 10,
            height: screenHeight/6,

        },
        card: {
            // flexShrink: 1.

        },
        cardContent: {
            justifyContent: "space-around",
            alignItems: "center",
            verticalAlign: "bottom",
            padding: 10

        },
        title:{
            fontSize: 20,
            fontWeight: "bold"
        },
        text: {
            fontSize: 10,

        },
        img: {
            // maxHeight: '100%',
            // maxWidth: '100%',
            height: screenHeight/10,
            width: screenWidth/5,
            borderRadius: 20,
        }
    }
)

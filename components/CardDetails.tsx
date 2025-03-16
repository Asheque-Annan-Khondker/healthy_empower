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
function GuideCard(img:ImageSourcePropType, title: string, description: string, link: string | { pathname: "/"; params?: RouteParamInput<"/"> | undefined; } | { pathname: "/(drawer)"; params?: RouteParamInput<"/(drawer)"> | undefined; } | { pathname: "/(drawer)/"; params?: RouteParamInput<"/(drawer)/"> | undefined; } | { pathname: "/(drawer)/(guide)/BeginnerGuide"; params?: RouteParamInput<"/(drawer)/(guide)/BeginnerGuide"> | undefined; } | { pathname: "/(drawer)/(tabs)"; params?: RouteParamInput<"/(drawer)/(tabs)"> | undefined; } | { pathname: "/(drawer)/(tabs)/"; params?: RouteParamInput<"/(drawer)/(tabs)/"> | undefined; } | { pathname: "/(drawer)/(tabs)/achievement_screen"; params?: RouteParamInput<"/(drawer)/(tabs)/achievement_screen"> | undefined; } | { pathname: "/(drawer)/(tabs)/diet_screen"; params?: RouteParamInput<"/(drawer)/(tabs)/diet_screen"> | undefined; } | { pathname: "/(drawer)/BeginnerGuide"; params?: RouteParamInput<"/(drawer)/BeginnerGuide"> | undefined; } | { pathname: "/(drawer)/achievement_screen"; params?: RouteParamInput<"/(drawer)/achievement_screen"> | undefined; } | { pathname: "/(drawer)/debugScreen"; params?: RouteParamInput<"/(drawer)/debugScreen"> | undefined; } | { pathname: "/(drawer)/diet_screen"; params?: RouteParamInput<"/(drawer)/diet_screen"> | undefined; } | { pathname: "/(drawer)/settings"; params?: RouteParamInput<"/(drawer)/settings"> | undefined; } | { pathname: "/(guide)/BeginnerGuide"; params?: RouteParamInput<"/(guide)/BeginnerGuide"> | undefined; } | { pathname: "/(tabs)"; params?: RouteParamInput<"/(tabs)"> | undefined; } | { pathname: "/(tabs)/"; params?: RouteParamInput<"/(tabs)/"> | undefined; } | { pathname: "/(tabs)/achievement_screen"; params?: RouteParamInput<"/(tabs)/achievement_screen"> | undefined; } | { pathname: "/(tabs)/diet_screen"; params?: RouteParamInput<"/(tabs)/diet_screen"> | undefined; } | { pathname: "/BeginnerGuide"; params?: RouteParamInput<"/BeginnerGuide"> | undefined; } | { pathname: "/_sitemap"; params?: RouteParamInput<"/_sitemap"> | undefined; } | { pathname: "/achievement_screen"; params?: RouteParamInput<"/achievement_screen"> | undefined; } | { pathname: "/debugScreen"; params?: RouteParamInput<"/debugScreen"> | undefined; } | { pathname: "/diet_screen"; params?: RouteParamInput<"/diet_screen"> | undefined; } | { pathname: "/settings"; params?: RouteParamInput<"/settings"> | undefined; } | { pathname: `./${string}`; params?: RouteParamInput<`./${string}`> | undefined; } | { pathname: `../${string}`; params?: RouteParamInput<`../${string}`> | undefined; } | { pathname: ".."; params?: RouteParamInput<".."> | undefined; } | { pathname: `${string}:${string}`; params?: RouteParamInput<`${string}:${string}`> | undefined; }) {
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

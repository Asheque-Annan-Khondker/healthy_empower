import {Card ,Avatar, Paragraph, Title} from 'react-native-paper'
import React, {memo, useCallback} from "react";
import {Dimensions, StyleSheet, StyleSheetProperties} from "react-native";
import Animated, {useAnimatedScrollHandler, useSharedValue} from "react-native-reanimated";
import {screenHeight, screenWidth} from "@/utils/deviceDetails";

export interface cardProps {
    onPress: () => void
    longPress?: () => void
    mainComponent?: React.ReactNode
    textContent: {
        title: string,
        subtitle?: string,
        description?: string,
        paragraph?: string
    }
    iconProps: React.ComponentProps<typeof Avatar.Icon>

    variant: "default" | "outlined" | "elevated"

}
// memoise function(cache it and only rerender for changes)
const CustomCard = memo((props:cardProps) => {
    //defaults
    const {
        onPress,
        longPress,
        textContent={title:"Default"},
        iconProps,
        variant="default"
    } = props;

    // note, the icon will stay relatively same so it's best to use call back to only rerender when its changed
    const leftContent = useCallback(() => <Avatar.Icon {...iconProps}/>,[])

    return (
        <Card style={styles.cardContainer} elevation={5} onPress={onPress}>
            <Card.Title title={textContent.title} subtitle={textContent.subtitle} />
            <Card.Content style={styles.cardContent}>
                <Title>{textContent.title}</Title>
                <Paragraph>{textContent.paragraph}</Paragraph>

            </Card.Content>
        </Card>
    )
})
export type CardItemType = cardProps | React.ReactElement<typeof CustomCard>



type  CardListProps = {
    cards: CardItemType[]
    horizontal?: boolean,
    cardStyles:{}
}
// Implement scrollable list of cards
const CustomCardList: React.FC<CardListProps> = ({ cards, horizontal=true, cardStyles=styles}) => {
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
                if(React.isValidElement(item)) return item
                else return <CustomCard {...item}/>
            }}
            scrollEnabled={true}
            style={cardStyles.cardContainer}
            contentContainerStyle={styles.contentContainer}
            data={cards}
            pagingEnabled={true}
            scrollEventThrottle={16}
            onScroll={scrollHandler}
            horizontal={horizontal}
        ></Animated.FlatList>
    )


}

export  {CustomCardList, CustomCard};

const styles = StyleSheet.create({
    cardContainer: {
        // backgroundColor: 'white',
        width: screenWidth - 30,
        height: screenHeight/6,
        // margin: 20,
    },
    contentContainer: {

        width: screenWidth - 30,
        height: screenHeight/6,
        alignItems: "center",
    },
    cardContent:{}
})
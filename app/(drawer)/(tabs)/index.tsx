import {Animated, Pressable, StyleSheet, Text, View} from "react-native";
import GuideCardList from "@/components/GuideCardDetails";
import {react_logo} from '@/assets/images/react_logo.png'
import {Image} from "expo-image";
import ScrollView = Animated.ScrollView;
// import ProfileHeader from "@/components/ProfileHeader";

const testCards = [
    {img: react_logo, title: "React", description:"This is the react logo", link:'https://reactjs.org'},
    {img: react_logo, title: "React", description:"This is the react logo", link:'https://reactjs.org'},
    {img: react_logo, title: "React", description:"This is the react logo", link:'https://reactjs.org'},
    {img: react_logo, title: "React", description:"This is the react logo", link:'https://reactjs.org'},
]

export default function Index() {
    return (
        <View>

            {/*<ProfileHeader/>*/}
            <ScrollView style={styles.intro}>


                <GuideCardList cards={testCards} horizontal={false}/>


            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
        intro: {
            borderRadius: 10
        }
    }
)

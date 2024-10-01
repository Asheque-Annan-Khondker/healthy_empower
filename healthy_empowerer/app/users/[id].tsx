import {View, Text} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {string} from "prop-types";

export default function UserPage() {
    // the type assertion is extra
    const {id} = useLocalSearchParams<{id : string}>();
    return(
        <View>
            <Text>Hello, User = {id}</Text>
        </View>
    );
}
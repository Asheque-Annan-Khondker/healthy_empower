import {Pressable, Text, View} from "react-native";
import {Link, router} from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
          backgroundColor: "black"
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/users/1">Click Here for User 1</Link>
        <Pressable onPress={() => router.push("/users/2")}><Text>Press here for 2</Text></Pressable>
    </View>
  );
}

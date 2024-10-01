// withSpring is for bounciness
//sharedValue is for reference point for all related animation
import Animated, {useSharedValue, withSpring} from "react-native-reanimated";
import { Button, View, StyleSheet } from "react-native";

export default function TestSquare(){
  const width = useSharedValue<number>(8)

  const onButtonPress = () => {
    return width.value = withSpring(Math.random() * 300 )
  }
  return(
    // Make a square then a toggle button which randomises the width of the square
    <View style={styles.container}>
      <Animated.View style={{...styles.square, width}} />
      <Button title="Click Here" onPress={onButtonPress} / >

     </View> 

    
  );
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
  },
  square: {
    height: 100,
    backgroundColor: 'violet',
    borderRadius: 20,

  },
})

import { Dimensions, StyleSheet } from "react-native";

const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
    header:{
    fontSize: 40,
    fontWeight: 'bold'
  },
  container:{
    flexGrow: 1
  },
  subContainer:{
    padding: 16,
    flex: 1
  },
  subHeader:{
    fontSize: 20,
    fontWeight: '400',
    marginVertical: 20
  },
  description:{
    fontSize: 16
  },
  img:{
    width: width*0.9, 
    height: height*0.2, 
    marginVertical: 20,
    resizeMode: 'cover'
  }
});

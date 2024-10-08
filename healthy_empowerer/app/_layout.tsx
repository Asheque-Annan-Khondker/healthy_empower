import {Drawer} from "expo-router/drawer";
import 'react-native-gesture-handler'
import {GestureHandlerRootView} from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <Drawer>
          <Drawer.Screen name={'/screens/guide_selection'} options={{drawerLabel: 'Guide Selection'}} />
        <Drawer.Screen name={'index'} options={{drawerLabel: 'Home'}} />
      </Drawer>
    </GestureHandlerRootView>
  );
}



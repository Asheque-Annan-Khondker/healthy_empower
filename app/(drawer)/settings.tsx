import ScreenTransition from '@/components/screenTransition'
import {Text, View} from 'react-native'
export default function Test(){
  return (
    <ScreenTransition type='zoom'>
    <View>
    <Text>Hi</Text>
    
    </View>
    </ScreenTransition>
  )
}

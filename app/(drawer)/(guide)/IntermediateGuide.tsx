import ScreenTransition from '@/components/screenTransition'
import React from 'react'
import {Text, View} from 'react-native'

export default function IntermediateGuide(){
  return (
    <ScreenTransition type='zoom'>
    <View>
    <Text>Guide for intermediates</Text>
    
    </View>
    
    </ScreenTransition>
  )
}
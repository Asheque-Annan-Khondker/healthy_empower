import ScreenTransition from '@/components/screenTransition'
import React from 'react'
import {Text, View} from 'react-native'

export default function BeginnerGuide(){
  return (
    <ScreenTransition type='zoom'>
    <View>
    <Text>Guide for noobs</Text>
    
    </View>
    
    </ScreenTransition>
  )
}
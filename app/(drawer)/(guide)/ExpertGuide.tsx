import ScreenTransition from '@/components/screenTransition'
import React from 'react'
import {Text, View} from 'react-native'

export default function ExpertGuide(){
  return (
    <ScreenTransition type='zoom'>
    <View>
    <Text>Guide for experts</Text>
    
    </View>
    
    </ScreenTransition>
  )
}
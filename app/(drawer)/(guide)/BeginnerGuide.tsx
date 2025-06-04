import ScreenTransition from '@/components/screenTransition';
import bannerImg from '@/assets/images/yoga.png';
import React from 'react';
import {Text, View, ScrollView, Image, SafeAreaView } from 'react-native';
//import { Card, MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Card, Provider as PaperProvider } from 'react-native-paper'
import styles from '@/app/(drawer)/(guide)/guideStyle';
import PlaceCard from '@/components/PlaceCard';
import BegCardsDisplay from '@/app/(drawer)/(guide)/cards/BegCardsDisplay';



/* !!!!!! NEEDS MORE STYLING  !!!!!!
      just barebone structure, we can fill in details later, we have more pressing matters 
      sorry guys im slow :((
      
      'Start-Up Guides' idea is subject to change, but for now leave as is.
      Decided on 'start-up' rather than fitness guides to make it easier to write general content 
      rather than specific workout plans/ guides which we'd have to think about A LOT.
      BUT it may change idk. for now this is easy, we can get back to it later.
*/

export default function BeginnerGuide(){
  return (
    <ScreenTransition type='zoom' >
      
      <ScrollView style={styles.container} > 
        <View style={styles.subContainer}>
          <Text style={styles.header}>For Beginners</Text>

          
          {/* temporary image, will change later */}
          <Image source={bannerImg} style={styles.img} />
          

          {/* Content description displayed in the form of cards */}
          <PaperProvider>
            <SafeAreaView>
              <BegCardsDisplay />
            </SafeAreaView>
          </PaperProvider>

        </View>

        

      </ScrollView>

    </ScreenTransition>
  )
}
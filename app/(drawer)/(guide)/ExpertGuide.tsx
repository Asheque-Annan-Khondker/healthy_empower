import ScreenTransition from '@/components/screenTransition';
import bannerImg from '@/assets/images/icon.png';
import React from 'react';
import {Text, View, ScrollView, Image, SafeAreaView } from 'react-native';
import { Card, Provider as PaperProvider } from 'react-native-paper'
import styles from '@/app/(drawer)/(guide)/guideStyle';
import ExpertCardsDisplay from '@/app/(drawer)/(guide)/cards/ExpertCardsDisplay';

/* !!!!!! NEEDS MORE STYLING  !!!!!!
      just barebone structure, we can fill in details later, we have more pressing matters 
      sorry guys im slow :((
      
      'Start-Up Guides' idea is subject to change, but for now leave as is.
      Decided on 'start-up' rather than fitness guides to make it easier to write general content 
      rather than specific workout plans/ guides which we'd have to think about A LOT.
      BUT it may change idk. for now this is easy, we can get back to it later.
*/

export default function ExpertGuide(){
  return (
    <ScreenTransition type='zoom' >
      
      <ScrollView style={styles.container} > 
        <View style={styles.subContainer}>
          <Text style={styles.header}>Start-Up Guide:{"\n"}For Experts</Text>

          <Text style={styles.subHeader}>
            GOAL: Optimise performance, aesthetics, or competition prep
          </Text>
          
          {/* temporary image, will change later */}
          <Image source={bannerImg} style={styles.img} />
          
          {/* all of these content ideas is subject to change
            content here will be based on 
            - GOAL: Optimize performance, aesthetics, or competition prep
            - Nutrition goal/tips: 
            - description/ content/ writing
            - Maybe some workout guides, whether theyre general or specific
          */}


          {/* Content description displayed in the form of cards */}
          <PaperProvider>
            <SafeAreaView>
              <ExpertCardsDisplay />
            </SafeAreaView>
          </PaperProvider>

        </View>
        

      </ScrollView>

    </ScreenTransition>
  )
}
import ScreenTransition from '@/components/screenTransition';
import bannerImg from '@/assets/images/icon.png';
import React from 'react';
import {Text, View, ScrollView, Image, SafeAreaView } from 'react-native';
import { Card, Provider as PaperProvider } from 'react-native-paper'
import styles from '@/app/(drawer)/(guide)/guideStyle';
import InteCard1 from '@/app/(drawer)/(guide)/cards/InteCard1';
import InteCard2 from '@/app/(drawer)/(guide)/cards/InteCard2';
import InteCard3 from '@/app/(drawer)/(guide)/cards/InteCard3';

/* !!!!!! NEEDS MORE STYLING  !!!!!!
      just barebone structure, we can fill in details later, we have more pressing matters 
      sorry guys im slow :((
      
      'Start-Up Guides' idea is subject to change, but for now leave as is.
      Decided on 'start-up' rather than fitness guides to make it easier to write general content 
      rather than specific workout plans/ guides which we'd have to think about A LOT.
      BUT it may change idk. for now this is easy, we can get back to it later.
*/

export default function IntermediateGuide(){
  return (
    <ScreenTransition type='zoom' >
      
      <ScrollView style={styles.container} > 
        <View style={styles.subContainer}>
          <Text style={styles.header}>Start-Up Guide:{"\n"}For Intermediates</Text>

          <Text style={styles.subHeader}>
            GOAL: Build muscle, endurance, and refine technique
          </Text>
          
          {/* temporary image, will change later */}
          <Image source={bannerImg} style={styles.img} />
          
          {/* all of these content ideas is subject to change
            content here will be based on 
            - GOAL: Build muscle, endurance, and refine technique
            - Nutrition goal/tips: 
            - description/ content/ writing
            - Maybe some workout guides, whether theyre general or specific
          */}


          {/* Content description displayed in the form of cards */}
          <PaperProvider>
            <SafeAreaView>
              <InteCard1 />
              <InteCard2 />
              <InteCard3 />
            </SafeAreaView>
          </PaperProvider>

        </View>
        

      </ScrollView>

    </ScreenTransition>
  )
}
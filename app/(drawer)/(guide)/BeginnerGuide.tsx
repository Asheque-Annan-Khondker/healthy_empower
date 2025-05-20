import ScreenTransition from '@/components/screenTransition';
import bannerImg from '@/assets/images/icon.png';
import React from 'react';
import {Text, View, ScrollView, Image, SafeAreaView } from 'react-native';
//import { Card, MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Card, Provider as PaperProvider } from 'react-native-paper'
import styles from '@/app/(drawer)/(guide)/guideStyle';
import PlaceCard from '@/components/PlaceCard';
import BegCard1 from '@/app/(drawer)/(guide)/cards/BegCard1';
import BegCard2 from '@/app/(drawer)/(guide)/cards/BegCard2';
import BegCard3 from '@/app/(drawer)/(guide)/cards/BegCard3';


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
          <Text style={styles.header}>Start-Up Guide:{"\n"}For Beginners</Text>

          <Text style={styles.subHeader}>
            Welcome to your first start-up guide!{"\n\n"}These guides are here to help you get moving in the right direction. 
            {"\n"}We are here to boost your confidence and productivity to reach your health and fitness goals!
          </Text>
          
          {/* temporary image, will change later */}
          <Image source={bannerImg} style={styles.img} />
          
          {/* all of these content ideas is subject to change
            content here will be based on 
            - GOAL: Build consistency, learn form, and improve general health
            - Nutrition goal/tips: 
            - description/ content/ writing
            - Maybe some workout guides, whether theyre general or specific
          */}

          <Text style={styles.subHeader}>
            GOAL: Build consistency, learn form, and improve general health
          </Text>

          {/* Content description displayed in the form of cards */}
          <PaperProvider>
            <SafeAreaView>
              <BegCard1 />
              <BegCard2 />
              <BegCard3 />
            </SafeAreaView>
          </PaperProvider>

        </View>

        

      </ScrollView>

    </ScreenTransition>
  )
}
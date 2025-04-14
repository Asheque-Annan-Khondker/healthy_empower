import ScreenTransition from '@/components/screenTransition';
import bannerImg from '@/assets/images/icon.png';
import React from 'react';
import {Text, View, ScrollView, Image} from 'react-native';
import styles from '@/app/(drawer)/(guide)/guideStyle';

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
            Welcome to your first start-up guide!{"\n\n"}These guides are here to help you get moving in the right direction. 
            {"\n"}We are here to boost your confidence and productivity to reach your health and fitness goals!
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
          <Text style={styles.description}> 
            Fill text later WE ARE SO COOKED {"\n"}
            Welcome to your first start-up guide!{"\n\n"}These guides are here to help you get moving in the right direction. 
            {"\n"}We are here to boost your confidence and productivity to reach your health and fitness goals!
            Welcome to your first start-up guide!{"\n\n"}These guides are here to help you get moving in the right direction. 
            {"\n"}We are here to boost your confidence and productivity to reach your health and fitness goals!
            Welcome to your first start-up guide!{"\n\n"}These guides are here to help you get moving in the right direction. 
            {"\n"}We are here to boost your confidence and productivity to reach your health and fitness goals!
            Welcome to your first start-up guide!{"\n\n"}These guides are here to help you get moving in the right direction. 
            {"\n"}We are here to boost your confidence and productivity to reach your health and fitness goals!
            Welcome to your first start-up guide!{"\n\n"}These guides are here to help you get moving in the right direction. 
            {"\n"}We are here to boost your confidence and productivity to reach your health and fitness goals!  
          </Text>
        </View>
        

      </ScrollView>

    </ScreenTransition>
  )
}
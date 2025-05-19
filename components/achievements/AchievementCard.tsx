import {Card, CardProps, List} from "react-native-paper";
import { Achievement } from "@/utils/table.types";
import React from "react";
import { StyleSheet } from "react-native";
import {CustomCard} from "@/components/CardDetails";
import {returnStatement} from "@babel/types";
import {FAIcon, IonIcon, MatIcon} from "@/utils/getIcon";
interface AchievementProps{
    achievement: Achievement
    onPress?:()=>void
    highlighted?: boolean
}


const AchievementCard= (props: AchievementProps) =>{

  return (<List.Item title={""} />)
    

}
export default AchievementCard;
const styles = StyleSheet.create({
    card:{}
})

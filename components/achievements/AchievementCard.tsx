import { Card } from "react-native-paper";
import { Achievement } from "./achievement.types";
interface AchievementProps{
    achievement: Achievement
    onPress?:()=>void
    highlighted?: boolean
}


export default function AchievementCard(){

    return(
        <Card>
        </Card>
    )
}
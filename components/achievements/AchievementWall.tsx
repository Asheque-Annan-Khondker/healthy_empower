// a container for lists of achievements

import React from "react";
import { getDatabase } from "@/utils/database";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { Achievement, ACHIEVEMENT_CATEGORIES, AchievementCategories } from "./achievement.types";
import { Avatar, Card, Chip, ProgressBar } from "react-native-paper";
import { react_logo } from "@/assets/images";
import { ScrollView } from "react-native-gesture-handler";

export default function AchievementWall(){
    const [achievements, setAchievements] = useState<Array<Achievement>>([])
    const [loading, setLoading] = useState(true)
    const [selectCategory, setSelectCategory] = useState('all')
    
    // when screen is focused
    useFocusEffect(
        useCallback(()=>{
            async function loadAchievements() {
                try{
                    setLoading(true)
                    // retrieve achievements from the db
                    const db = await getDatabase()
                    const results = await db.execAsync(`
                select * from achievements
                order by completed asc, progress desc`)
                        // check any achievements are unlocked
                        if (results && results.length > 0){
                            setAchievements(results)
                        } else {
                            setAchievements(PLACEHOLDER_ACHIEVEMENTS)
                        }
                        // 
                        
                    } catch (err){
                        console.error('err in achievement wall: ', err)
                    } finally{
                        setLoading(false)
                    }
                }
                    loadAchievements()
                    // clean up
                    return () => {
                        // clean up any residue data when the component unmounts
                    }
            }, []
        )
    )
    // animation for highlighting achievement
    useEffect(()=>{
    })
    //category filter
    const filteredAchievements = selectCategory === 'all' ? achievements : achievements.filter(a=>a.category === selectCategory)
    const totalAchievements = achievements.length
    return (
        <View>
            <ScrollView>
                <Chip
                    selected={selectCategory==='all'}
                    onPress={()=>setSelectCategory('all')}
                    >HI
                        </Chip>
                        {/* Make a list of the achievements based on the category */}
                        {Object.values(ACHIEVEMENT_CATEGORIES).map(category =>(
                            <Chip key={category} selected={selectCategory===category}
                                    onPress={()=>setSelectCategory(category)}>{category</Chip>

                        ))}
                        
            </ScrollView>
        </View>
    )
}


const AchievementCard = (props:Achievement)=>{
    <Card>
            <Card.Title
                title="Howdy, I'm ya paps"
                subtitle="Can't believe it, eh?"
                left={(props)=><Avatar.Icon {...props} icon={"trophy"}/>}
                right={(props)=><Text style={styles.xp}> +? XP</Text>}
                
            />
            <Card.Cover source={react_logo} style={styles.cardCover} />
        <Card.Content>
        <ProgressBar progress={22} />
        <Text>Completed on march 7th</Text>
        </Card.Content>
    </Card>
}

const PLACEHOLDER_ACHIEVEMENTS = [
    {
        id: 1,
        title: 'First Workout',
        description: 'Complete your first workout',
        icon: 'weight-lifter',
        category: ACHIEVEMENT_CATEGORIES.FITNESS,
        completed: true,
        progress: 1,
        target_progress: 0,
        completion_date: '2025-02-20',
        xp_reward: 50
    },
    {
        id: 2,
        title: 'Calorie Tracker',
        description: 'Log your meals for 7 consecutive days',
        icon: 'food-apple',
        category: ACHIEVEMENT_CATEGORIES.NUTRITION,
        completed: false,
        progress: 5,
        target_progress: 7,
        completion_date: '',
        xp_reward: 100
    },
    {
        id: 3,
        title: 'Protein Champion',
        description: 'Meet your protein goal for 5 days',
        icon: 'food-steak',
        category: ACHIEVEMENT_CATEGORIES.NUTRITION,
        completed: false,
        progress: 2,
        target_progress: 5,
        completion_date: '',
        xp_reward: 75
    }
];

const styles = StyleSheet.create({
    xp: {},
    cardCover:{}
})
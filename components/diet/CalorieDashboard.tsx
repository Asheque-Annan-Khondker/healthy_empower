import { getDatabase } from "@/utils/database";
import { useFocusEffect } from "expo-router";
import { useFilterScreenChildren } from "expo-router/build/layouts/withLayoutContext";
import React, { useCallback } from "react";
import {useEffect, useState} from 'react'
import { View, Text, StyleSheet, Dimensions } from "react-native";
import {LineChart} from 'react-native-chart-kit'
import {Card, Title, Paragraph, ActivityIndicator} from 'react-native-paper'
export default function CalorieDashboard(){
const [meals, setMeals] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
const [data, setData]= useState({
    labels:[] as String[],
    datasets:[{data:[] as number[]}]
})

        async function loadHistory(){
            try{
                // get the last thirty days
                const monthago= new Date()
                monthago.setDate(monthago.getDate()-30)
                const date = monthago.toISOString().split('T')[0]



            setLoading(true)
            let db = await getDatabase()
            const result = await db.getAllAsync(`
                select date, sum(calories) as total_calories
                from food_entries
                where date >= ?
                group by date
                order by date asc
                `, [date])
            setMeals(result)
            // map data out
            const labels = result.map((item)=>{
                const dater = new Date(item.date);
                return `${dater.getMonth()+1}/${dater.getDate()}`
            })
            const calories = result.map(item=>item.total_calories)
            //set chart data

            setData({
                labels: labels,
                datasets: [{data: calories}]
            })

            setLoading(false)
        } catch(err){
            console.log(err)
            setError('Failed to Load data')
            setLoading(false)
        }


        }
        //initial mount
        useEffect(()=>{loadHistory()},[])
        //subsequent mount every screen refresh
        useFocusEffect(
            useCallback(()=>{
                loadHistory()

                return () => {
                    console.log('Screen unfocused')
                }
            },[])
        )

        if(loading==true){
        return(
            <Card >
                <Card.Content>
                    <ActivityIndicator size={'large'} color="'#0000ff" />
                    <Text>Loading your calorie history...</Text>
                </Card.Content>
            </Card>
        )
    } else{
        return(
        <Card style={styles.card}>
            <Card.Content>
                <Title>Calories</Title>
                <Paragraph>Over 30 days</Paragraph>
<View style={styles.chartContainer}>
                    <LineChart
                        style={styles.chart}
                        data={data}
                        width={Dimensions.get("window").width-60}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#e26a00",
                            backgroundGradientFrom: "#fb8c00",
                            backgroundGradientTo: "#ffa726",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

                            propsForDots: {
                              r: "6",
                              strokeWidth: "2",
                              stroke: "#ffa726"
                            }
                          }}
                          bezier
                          />
                          
                </View>
            </Card.Content>
        </Card>
        )
    }
}


const styles = StyleSheet.create({
    card: {
      margin: 16,
      elevation: 4,
      borderRadius: 12,
      width: Dimensions.get("window").width - 30
    },
    loadingContainer: {
      alignItems: 'center',
      padding: 20,
    },
    loadingText: {
      marginTop: 10,
    },
    errorText: {
      color: 'red',
      marginTop: 10,
    },
    chartContainer: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 10,
    },
    chart: {
      borderRadius: 16,
    },
    noDataText: {
      textAlign: 'center',
      marginTop: 30,
      marginBottom: 30,
      color: '#888',
      fontStyle: 'italic',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 15,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: '#eee',
    },
    stat: {
      alignItems: 'center',
    },
    statLabel: {
      fontSize: 12,
      color: '#888',
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
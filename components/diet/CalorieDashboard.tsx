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
    labels:[] as string[],
    datasets:[{data:[] as number[]}]
  })
  
  async function loadHistory(){
    try {
      // 1. Log the filter date
      const monthago= new Date()
      monthago.setDate(monthago.getDate()-30)
      const monthagostr = monthago.toISOString().split('T')[0]
      console.log("FILTER DATE:", monthagostr) // e.g. 2024-02-11
      
      setLoading(true)
      
      let db = await getDatabase()
      
      // // 2. Check if ANY data exists
      // const checkResult = await db.getAllAsync(`SELECT COUNT(*) as count FROM food_entries`)
      // console.log("TOTAL ENTRIES:", checkResult[0]?.count)
      
      // // 3. Check ALL dates without filter
      // const dateCheck = await db.getAllAsync(`SELECT DISTINCT date FROM food_entries`)
      // console.log("ALL DATES IN DB:", JSON.stringify(dateCheck))
      
      const result = await db.getAllAsync(`
      SELECT date, SUM(calories) as total_calories
      FROM food_entries
      WHERE date >= ?
      GROUP BY date
      ORDER BY date ASC`, [monthagostr])
        const labels = []
        const calories = []

        // just in case if data is not loaded for the graph, which leads to crashes.
        
        if(result.length == 0){
        
        const calorieMap = {}
        result.forEach(row => {
          calorieMap[row.date] = row.total_calories
        })
          for (let i = 0; i < 30; i++) {
            
            const date = new Date()
            date.setDate(date.getDate() - (29 - i)) 
            const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD
            const shortLabel = dateStr.substring(5) // MM-DD
            
            labels.push(shortLabel)
            calories.push(calorieMap[dateStr] || 0) // fills in missing calories with zero

          }} else {
            result.forEach(row => {
              labels.push(row.date.substring(5))
              calories.push(row.total_calories)
            })
          }
          setData({
            labels,
            datasets:[{data:calories}]
          })
          console.log("Check retrieval", JSON.stringify(result))
          
          
          
          setLoading(false)
          
        } catch(err) {
          console.log("ERROR:", err)
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
          <ActivityIndicator size={'large'} color="#0000ff" />
          <Text>Loading your calorie history...</Text>
          </Card.Content>
          </Card>
        )
      } else{
        return(
          <Card style={styles.card}>
          <Card.Content>
          <Title>Calorie Intake Graph</Title>
          <Paragraph>Over last 30 days</Paragraph>
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
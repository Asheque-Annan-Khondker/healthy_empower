import {ScrollView, View} from "react-native";
import {FAB, List, Portal, Title, DataTable} from "react-native-paper";
import {FAIcon} from "@/utils/getIcon";
import {useCallback, useEffect, useState} from "react";
import MealEntryForm from "@/components/diet/MealEntryForm";
import {FoodDBModal, GoalDBModal, MealLogDBModal} from "@/utils/dbFunctions";
import {Food, FoodMacros, Goal, MealLog} from "@/utils/table.types";
import {useFocusEffect} from "expo-router";
import React from "react";
import GuideScreen from "@/components/guides/GuideDetail";
import CustomPaperList from "@/components/CustomPaperList";
import {ProgressBar} from "@/components/ProgressBar";
import PlaceCard from "@/components/PlaceCard";
import CustomChart from "@/components/CustomChart";

export default function DietScreen() {
  const [state, setState] = useState( {open: false})
  const [foodList, setFoodList] = useState<Food[]>([]);
  const [mealLog, setMealLog] = useState<MealLog[]>([])
  const [goalList, setGoalList] = useState<Goal[]>([]);
  const [macroProgress, setMacroProgress] = useState<Record<keyof FoodMacros, number[]>>({
    protein: [],
    carbs: [],
    fat: [],
    calories: [],
  })
  
  // get the current progress from the backend
  const [progressFill, setProgressFill] = useState<number>(0)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const onStageChange = ({open}) =>setState({open: open})
  // When user submits new food entry.
  const onSubmitGetFood = async () => {
    try {
      const foodres = await FoodDBModal.get({name: 'fish'})
      setFoodList(foodres)
    } catch (err) {
      console.error("Submit Food Retrieval error: ", err);
    }
  }
  // update when user submits new food
  //   May not need this if mealForm can do it
  //   useEffect(()=>{
  //   getFoodData()
  //   
  // },[mealLog])
  
  async function getGoalData() { 
    try {
      
      const goalres = await GoalDBModal.get()
      setGoalList(goalres)
      
    } catch (err) {
      console.error("Goal Retrieval error: ", err);
    }
  }
  
  async function getFoodData() {
    try {
      const foodres = await FoodDBModal.get({
        protein: {gte: 4 },
      } )           
      
      setFoodList(foodres)
      
    } catch (err) {
      console.error("Food Retrieval error: ", err);
    }
    
    try {
      
      const mealres = await MealLogDBModal.get()
      setMealLog(mealres)
      
    } catch (err) {
      console.error("Meal Retrieval error: ", err);
    }
  }
  // Screen focus refresh
  useFocusEffect(
    useCallback(()=>{
      async function fetchall(){
        getFoodData()
        const progress = await macroProgressAgregator({protein: 100, carbs:50, fat: 100, calories: 9000}, 30)
        setMacroProgress(progress)
        getGoalData()
      }
      fetchall()
      return ()=>console.log("refreshing foodList")
    },[])
  )
  
  const {open} = state
  // action should have an onpress that shows the modal
  return(
    <View style={{flex: 1}} >
    <View style={{flex: 1}} >
    <Title>Dashboard</Title>
    <ProgressBar progress={10} height={20} backgroundColor={"#e0e0e0"} progressColor={"#5acdff"}/>
    <ScrollView style={{flex: 1}} horizontal>
    {foodList.map((food)=>(
      <PlaceCard title={food.name} subtext={food.meal_type}
      leftBottomText={'Wow'} tag={food.food_id} image={''}/>
    ))}
    </ScrollView>
    <ScrollView style={{flex: 1}} horizontal>
    {mealLog.map((meal)=>(
      <PlaceCard title={meal.food_id} subtext={meal.logged_at}
      leftBottomText={'Wow'} tag={meal.meal_type} image={''}/>
    ))}
    </ScrollView>            {/*    Put in a graph about macros, multi-line overlap
      {/*    Make in percentage based*/}
      </View>
      
      <Portal>
      <MealEntryForm onDismiss={()=>setModalVisible(false)} visibility={modalVisible} onMealAdd={getFoodData}  />
      <FAB.Group   actions={[
        { icon: 'plus', onPress: () => console.log('Pressed add') },
        {
          icon: 'pen',
          label: 'Write',
          onPress: () => setModalVisible(true),
        },
        {
          icon: 'camera',
          label: 'Photo',
          onPress: () => console.log('Pressed email'),
        },
        {
          icon: 'bell',
          label: 'Remind',
          onPress: () => console.log('Pressed notifications'),
        },
      ]} icon={()=><FAIcon name={"key"} color={"white"}/>}  onStateChange={onStageChange} visible={true} open={open}/>
      </Portal>
      <CustomPaperList title="Custom PaperList" content={foodList}/>
      </View>
    )
  }
  
  // Helper function to calculate the progress of each macro relative to the goal
  export function macroCalculationsToGoal(macro: FoodMacros, goal:FoodMacros){

    const macroKeys = ['protein', 'carbs', 'fat', 'calories'] 
    // output the percentages of each macro progression relative to the goal
    // rewrite for iteration
    // Make an empty object with type FoodMacros then assign the keys  as keys from FoodMacros
    // Since there are multiple keys, an array bracket is appended at the end
    // Reduce collects all the values of the macro into an object after operating on it
    // Record makes the returned object a dictionary with the keys as the keys of FoodMacros and 
    // the values whatever was calculated
    const macroProgress = macroKeys.reduce((val, key) =>{
      val[key] = (macro[key] / goal[key]) * 100
      console.log(`Goal ${key}: `, goal[key])
      console.log(`percentage ${key}: `, val[key])
      
      return val
    }, {} as Record<keyof FoodMacros, number>)

    return macroProgress
    
  }
  
  async function macroProgressAgregator( goal: FoodMacros, time: number){
    // output an array of arrays of of each macro over time
    //time is counted in days backwards
      const macroKeys = ['protein', 'carbs', 'fat', 'calories'] 
    console.log("Before getMacroProgress ") 
    async function getMacroProgress(){
      //Get the macro progress from the database
      console.log("before getMeal")
      try {

        console.log("after getMeal")
        const endDate = new Date()
        const startDate = new Date()
        //! Change this back to time
        startDate.setDate(endDate.getDate() - time)
        
        const formattedStartDate = startDate.toISOString()
        const mealLog = await MealLogDBModal.get({logged_at: {gte: formattedStartDate}})
        console.log("mealLog: ", mealLog) 
        // const filterdMealLogs = mealLog.filter((meal) =>{
        //   return meal.logged_at.split('T')[0] >= formattedStartDate && meal.logged_at.split('T')[0]<= formattedEndDate
        // })
        const extractedInfo = mealLog.map((meal) => ({
          // date: new Date(meal.logged_at).toISOString().split('T')[0],
          servings: meal.servings,
          fid: meal.food_id
          
        }))
        console.log("Extracted info: ", extractedInfo)
        const nutritionList  = await (await Promise.all(extractedInfo.map(info => FoodDBModal.get({food_id: {eq: info.fid}})))).flat()
        console.log("Nutrition list: ", nutritionList)
        // Multiply each nutrition property by the servings
        //this will iterate over each food
        const scaledNutritionList = nutritionList.map((nutrition, index)=>{
          const servings = extractedInfo[index].servings
          // need to iterate over each macro
          const scaledNutrition = macroKeys.reduce((sumval, key)=>{
            console.log("reduce ScaledNutrition key: ",key )
            sumval[key] = nutrition[key] * servings
            return sumval
          // {} as ... is the initial value in case the nutrition is empty
          }, {} as Record<keyof FoodMacros, number>)
          return scaledNutrition
        })
        
        console.log("Nutrition history: ",scaledNutritionList)
        // return {scaledNutritionList, dates: extractedInfo.map((info) => info.date)}
        return scaledNutritionList
      } catch(err){
        console.error("Error getting meal log: ", err)
      }
    }
    const nutritionHistory = await getMacroProgress()
    console.log("Nutrition history: ", nutritionHistory)
    const macroProgress= {} as Record<keyof FoodMacros, number[]>
    macroKeys.forEach((key)=>{
      macroProgress[key] = []
    })
    
    // Get an array of all the macroprogress over time
    nutritionHistory.forEach((macroInstance: FoodMacros) => {
      const progress = macroCalculationsToGoal(macroInstance, goal)
      console.log("PercentageProgress: ", progress)
      macroKeys.forEach((key) =>{
        macroProgress[key].push(progress[key])
      })
    }
  )
  return macroProgress
  
  
}

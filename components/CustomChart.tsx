// Keep this for backup. Try to use VictoryCharts instead(it's cooler)
import {LineChart, RadarChart, LineChartPropsType, RadarChartProps} from "react-native-gifted-charts";
import {StyleSheet, View} from "react-native";
import React from "react";
import {ProgressChartProps} from "react-native-chart-kit/dist/ProgressChart";
import {ProgressChart} from "react-native-chart-kit";

type ChartType = "line" | "spider" | "area" | "progress"

// Base data interface
interface DataPoint {
    label: string
    value: number
}
interface EntryRadarChartProps {
    data: DataPoint[]
   // props: RadarChartProps
}



const LineBasedChart = (props: LineChartPropsType) => {
// Write the constant props for LineChart

   const ChartConfig: LineChartPropsType = {

   }

return (
    <View style={styles.chartConatainer}>
        <LineChart {...props} {...ChartConfig} />
    </View>)
}
const CustomSpiderChart = (props: EntryRadarChartProps) => {
    // seperate the dataset into an array of labels and values
    const valueArray = props.data.map((entry) => entry.value)
    let labelArray: string[] = props.data.map((entry) =>  entry.label)
    labelArray= new Array.from(new Set(labelArray))

    // Configure the const without getting in the way of the data handling
    const customisation: RadarChartProps = {

    }

    const  radarProps: RadarChartProps = {
        data:valueArray,
        labels:labelArray,
        ...customisation
    }

    return (
        <View style={styles.chartConatainer}>
            <RadarChart {...radarProps}/>
        </View>
    )
}

const CustomProgressChart = (props: ProgressChartProps) => {
    const chart = ProgressChart
}

interface CustomChartProps {
    type: ChartType
    data: DataPoint[]
}


const CustomChart: React.FC<CustomChartProps> = ({type, data})=> {
    // 3 types: line, spider and area
    // data is dependent on the type
    console.log("in CustomChart: ", type)
    switch (type) {
        case "line":
            return <LineBasedChart data={data}/>
        case "spider":
            return <CustomSpiderChart data={data}/>
        case "area":
            return <LineBasedChart areaChart data={data}/>
        case "progress":

        default:
            throw new Error(`Unknown type "${type}"`)
    }

}
export default  CustomChart;
const styles = StyleSheet.create({
    chartConatainer:{

        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    }
})
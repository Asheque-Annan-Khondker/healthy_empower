import { FoodMacros } from '@/utils/table.types';
import React from 'react';
import { LineChart } from 'react-native-gifted-charts';
import { View, Text } from 'react-native';

interface DataPoint {
  value: number;
  label?: string;
}

interface CustomChartProps {
  data: DataPoint[];
  type?: 'line' | 'bar';
  width?: number;
  height?: number;
}

export default function CustomChart({ 
  data, 
  type = 'line', 
  width = 300, 
  height = 200 
}: CustomChartProps) {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text>No data available</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 10 }}>
      <LineChart
        data={data}
        width={width}
        height={height}
        curved
        thickness={3}
        color="#5acdff"
        hideDataPoints={false}
        spacing={50}
        backgroundColor="#FFFFFF"
        rulesColor="#E0E0E0"
        rulesThickness={1}
      />
    </View>
  );
}





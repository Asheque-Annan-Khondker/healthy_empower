import { FoodMacros } from '@/utils/table.types';
import React from 'react';


interface DPoint {
  x: number;
  [key: string]: number;
}

interface CustomChartProps {
  data: DPoint[];
  xKey: string;
  yKey: string[];
}
// input: {{key: [], key2: []}, range x, range y 
export default function CustomChart({data, xKey, yKey}: CustomChartProps){
    return (
        <CartesianChart
            data={data}
            xKey={xKey}
            yKeys={yKey}
        >
        {({points, yKey}) => (
          <>
            {yKey.map((key, index) => (
              <Line
                key={index}
                points={points[key]}
                strokeWidth={3}
               
              />
            ))}
          </>
        )}
        

    </CartesianChart>
    )
}





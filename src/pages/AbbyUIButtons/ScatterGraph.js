
import React from 'react'
import {VictoryScatter,VictoryChart, VictoryTheme} from 'victory';

export default function Scater() {
    const sampleData =[
        {x: 1, y: 4},
        {x: 2, y: 5},
        {x: 3, y: 6},
        {x: 4, y: 7}
      ];
    return(
<VictoryChart
  theme={VictoryTheme.material}
  domain={{ x: [0, 5], y: [3, 7] }}
  width={300}
  height={300}
  
>
  <VictoryScatter
    style={{ data: { fill: "#c43a31" } }}
    size={4}
   
    data = {sampleData}
  />
</VictoryChart>)}
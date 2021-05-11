import React from 'react';
import { VictoryHistogram, VictoryChart, VictoryLine, VictoryBar } from 'victory';



function ScoreAllGraph(){
    const sampleHistogramData = [
        {cell: 1, score: 0.9777},
        {cell: 2, score: 0.69696},
        {cell: 3, score: 0.889888},
        {cell: 4, score: 0.666666}
      ];
    return(
        <div>
            <VictoryChart
            domainPadding={20}
            >
    
            <VictoryBar
                style={{ data: { fill: "#c43a31" } }}
                data={sampleHistogramData}
                x="cell"
                y="score"
            
            />
               
            </VictoryChart>
        </div>
    );
}
export default ScoreAllGraph; 
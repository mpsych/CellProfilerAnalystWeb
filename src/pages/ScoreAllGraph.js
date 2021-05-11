import React from 'react';
import { VictoryHistogram, VictoryChart, VictoryLine, VictoryBar } from 'victory';



function ScoreAllGraph(){
    const sampleHistogramData = [
        {x: 1},
        {x: 1},
        {x: 1},
        {x: 2},
        {x: 2},
        {x: 3}, 
        {x:30}
      ];
    return(
        <div>
            <VictoryChart>
                <VictoryHistogram
                    style={{
                    data: { fill: "#c43a31" }
                    }}
                    data={sampleHistogramData}
                    bins={30}
                />
                </VictoryChart>
        </div>
    );
}
export default ScoreAllGraph; 
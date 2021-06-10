import React from 'react';
import { VictoryHistogram, VictoryChart, VictoryLine, VictoryBar } from 'victory';

function ScoreAllGraph(props) {
	return (
		<div>
			<VictoryChart>
				<VictoryHistogram
					style={{
						data: { fill: 'rgb(84,136,187)' },
						top:0 
					}}
					data={props.histogramData}
					bins={30}
				/>
			</VictoryChart>
		</div>
	);
}
export default ScoreAllGraph;

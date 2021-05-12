import React from 'react';
import { VictoryHistogram, VictoryChart, VictoryLine, VictoryBar } from 'victory';

function ScoreAllGraph(props) {
	return (
		<div>
			<VictoryChart>
				<VictoryHistogram
					style={{
						data: { fill: '#c43a31' },
						height: 200,
						width: 200,
					}}
					data={props.histogramData}
					bins={30}
				/>
			</VictoryChart>
		</div>
	);
}
export default ScoreAllGraph;

import React from 'react';
import { VictoryHistogram, VictoryChart, VictoryLine, VictoryBar } from 'victory';

function ScoreAllGraph(props) {
	const sampleHistogramData = [{ x: 1 }, { x: 2 }, { x: 6 }, { x: 5.3 }, { x: 4.44 }, { x: 12 }];
	return (
		<div>
			<VictoryChart domainPadding={{ x: 30 }}>
				<VictoryHistogram
					style={{
						data: { fill: '#c43a31' },
						height: 200,
						width: 200,
					}}
					data={props.histogramData}
				/>
			</VictoryChart>
		</div>
	);
}
export default ScoreAllGraph;

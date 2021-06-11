import React from 'react';
import { VictoryHistogram, VictoryChart, VictoryLine, VictoryAxis, VictoryLabel } from 'victory';
import { beta } from 'jStat';
import { useRef, useEffect, useState } from 'react';
const beta_pdf = beta.pdf;
// const bin_width = 0.02;
// const alphaValue = 1.59;
// const betaValue = 11.38;

function ScoreAllGraph(props) {
	const histRef = new useRef();
	const [maximum, setMaximum] = useState(0);
	const [alphaValue, setAlphaValue] = useState();
	const [betaValue, setBetaValue] = useState();
	const [binWidth, setBinWidth] = useState();
	useEffect(() => {
		const datum = histRef.current.baseProps[0].data.datum;
		console.log(datum.x1 - datum.x0);
		setBinWidth(datum.x1 - datum.x0);
	}, [histRef]);
	useEffect(() => {
		console.log('alphas:', props.alphas);
		setAlphaValue(props.alphas[1]);
		setBetaValue(props.alphas[0]);
	}, [props.alphas]);

	useEffect(() => {
		let newMax = 0;
		for (let i = 0; i < props.histogramData.length; i++) {
			if (newMax < props.histogramData[i].x) {
				newMax = props.histogramData[i].x;
			}
		}
		console.log(newMax);
		setMaximum(newMax);
	}, [props.histogramData]);

	return (
		<div>
			<VictoryChart domain={{ x: [0, maximum] }}>
				<VictoryAxis />
				<VictoryAxis dependentAxis />
				<VictoryHistogram
					ref={histRef}
					style={{
						data: { fill: 'rgb(84,136,187)' },
						top: 0,
					}}
					data={props.histogramData ? props.histogramData : undefined}
					bins={30}
					// y={props.histogramData ? (datum) => datum.y : undefined}
				/>
				<VictoryLabel
					textAnchor="middle"
					style={{ fontSize: 12 }}
					x={280}
					y={60}
					text={
						alphaValue && betaValue
							? `Alpha: ${alphaValue.toFixed(3)}, Beta: ${betaValue.toFixed(3)}`
							: undefined
					}
				/>
				<VictoryLine
					style={{ data: { stroke: 'purple' } }}
					y={(datum) => beta_pdf(datum.x, alphaValue, betaValue) * binWidth * props.histogramData.length}
					samples={150}
				/>
			</VictoryChart>
		</div>
	);
}
export default ScoreAllGraph;

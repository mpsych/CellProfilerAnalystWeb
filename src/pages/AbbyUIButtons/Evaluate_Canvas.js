import React from 'react';
import * as tfvis from '@tensorflow/tfjs-vis';
const drawConfusionMatrix = async (divElement, confusionMatrixValues) => {
	await tfvis.render.confusionMatrix(
		divElement,
		{
			values: confusionMatrixValues,
			tickLabels: ['Positive', 'Negative'],
		},
		{
			height: 200,
			width: 300,
		}
	);
};

export default function Canvas1(props) {
	const canvasParentRef = React.useRef(null);
	React.useEffect(() => {
		drawConfusionMatrix(canvasParentRef.current, props.confusionMatrix);
	}, [canvasParentRef, props.confusionMatrix]);

	return (
		<div style={{ padding: 40 }}>
			<div ref={canvasParentRef}></div>
		</div>
	);
}

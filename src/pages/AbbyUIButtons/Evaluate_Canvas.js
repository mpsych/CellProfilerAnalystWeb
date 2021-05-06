
import React from "react";
import * as tfvis from "@tensorflow/tfjs-vis";
const drawConfusionMatrix = async (divElement, confusionMatrixValues) => {
  await tfvis.render.confusionMatrix(
    divElement,
    {
      values: confusionMatrixValues,
      tickLabels: ["Positive", "Negative"]
    },
    {
      height: 200,
      width: 300
    }
  );
};

export default function Canvas1() {
  const canvasParentRef = React.useRef(null);
  const [confusionMatrix, setConfusionMatrix] = React.useState([
    [0, 0],
    [0, 0]
  ]);

  // runs when canvasParentRef is initialized
  // and also when confusionMatrix is updated
  React.useEffect(() => {
    // set the confusion matrix with sample data
    //??? need to figure out how to pass the function value
    setConfusionMatrix([
      [20, 6],
      [7, 32]
    ])
    drawConfusionMatrix(canvasParentRef.current, confusionMatrix);
  }, [canvasParentRef, confusionMatrix]);

  return (
    <div style = {{padding:40}}>

      <div ref={canvasParentRef}></div>
    </div>
  );
}


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

export default function Canvas1(props) {
  const canvasParentRef = React.useRef(null);
  // const [confusionMatrix, setConfusionMatrix] = React.useState(props.confusionMatrix);

  // runs when canvasParentRef is initialized
  // and also when confusionMatrix is updated
  React.useEffect(() => {
    // set the confusion matrix with sample data
    //??? need to figure out how to pass the function value
    
    console.log(props.confusionMatrix)
    drawConfusionMatrix(canvasParentRef.current, props.confusionMatrix);
  }, [canvasParentRef]);

  return (
    <div style = {{padding:40}}>

      <div ref={canvasParentRef}></div>
    </div>
  );
}

// import React, {useRef} from 'react';

// const Canvas = props => 
// {
//     const canvasRef = useRef(null)
//     const canvas = canvasRef.current
//     const context = canvas.getContect('2d')
//     return <canvas ref = {canvasRef}></canvas>

// }

// export default Canvas

//import "./styles.css";
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
      {/* This won't be in the dialog window it is just a
           button to test that we can change confusion matrix by state */}
      {/* <button
        onClick={() =>
          setConfusionMatrix([
            [20, 6],
            [7, 32]
          ])
        }
      >
        change matrix
      </button> */}

      <div ref={canvasParentRef}></div>
    </div>
  );
}

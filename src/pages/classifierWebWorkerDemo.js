
// import React from 'react';
// import {Button, CircularProgress}from '@material-ui/core'; 
// import "bootstrap/dist/css/bootstrap.css";
// import UploadHandler from '../classes/UploadHandler'
// import Classifier from '../classes/Classifier'
// import * as tfvis from '@tensorflow/tfjs-vis'
// import { v4 as uuidv4 } from 'uuid';
//   import "../dndstyles.css";



// // function TestUI(){
    
// //     const [dataWebWorker, setDataWebWorker] = React.useState(null)
// //     const [classifierWebWorker, setClassifierWebWorker] = React.useState(null)
// //     const [fetchEnabled, setFetchEnabled] = React.useState(false)

//     const trainingLossCanvasParentRef = React.useRef();
//     const trainingAccuracyCanvasParentRef = React.useRef();

//     React.useEffect(() => {
//         console.log("initializing webworkers")
//         const workerChannel = new MessageChannel();

//         const dataWebWorker = new Worker('../dataWorker.js')
        
//         dataWebWorker.addEventListener("error", event => {
//             console.log('[dataWebWorker] Error', event.message, event);
//         });
       
//         dataWebWorker.postMessage({action: "connectToClassifierWorker"}, [workerChannel.port1])
//         setDataWebWorker(dataWebWorker)

//         const classifierWebWorker = new Worker('../classifierWorker.js')
//         classifierWebWorker.addEventListener("message", event => {
//             console.log("entry back to main thread from classifierworker")
//             switch(event.data.action) {
//                 case "updateTrainingLossCanvas":
//                     console.log("update Loss canvas")
//                     tfvis.show.history(trainingLossCanvasParentRef.current, event.data.trainLogs, event.data.ticks)
//                     break;
//                 case "updateTrainingAccuracyCanvas":
//                     console.log("update Accuracy canvas")
//                     tfvis.show.history(trainingAccuracyCanvasParentRef.current, event.data.trainLogs, event.data.ticks)
//                     break;
//             }
//         })
//         classifierWebWorker.addEventListener("error", event => {
//             console.log('[classifierWebWorker] Error', event.message, event);
//         });

//         // classifierWebWorker.postMessage({action: "init"})
//         classifierWebWorker.postMessage({action: "connectToDataWorker"}, [workerChannel.port2])
//         setClassifierWebWorker(classifierWebWorker)

//         // classifierWebWorker.postMessage({action: "testSendToDataWorker"})
//         // dataWebWorker.postMessage({action: "testSendToClassifierWorker"})

//     }, [trainingLossCanvasParentRef, trainingAccuracyCanvasParentRef])

// //     const workerGetRowPromise = async (worker, index) => {
// //         return new Promise(resolve => {
// //             const UUID = uuidv4()

// //             // listener which resolves the promise only with the get row command and the correct uuid
// //             const onGetRowListener = (event) => {
// //                 if (event.data.action === "get_row" && event.data.uuid === UUID) {
// //                     resolve(event.data.row)
// //                 }
                
// //             }
// //             //call this listener when comes back, {once} means listener should remove itself when done
// //             worker.addEventListener("message", onGetRowListener, {once: true}) 
// //             // start the async get row call in the background, 
// //             // the uuid is there to make sure its the right one even when things are happening in parallel
// //             worker.postMessage({action: "get_row", index, uuid:UUID});
// //         })  
// //     }

//     const dataWorkerActionPromise = (action, data) => {
//         const UUID = uuidv4()
//         return new Promise(resolve => {
//             dataWebWorker.addEventListener("message", event => {
//                 if (event.data.uuid === UUID) {
//                     resolve(event)
//                 }
                
//             }, {once: true})
//             dataWebWorker.postMessage({action, ...data, uuid:UUID});
//         })
        
//     }

//     const classifierWorkerActionPromise = (action, data) => {
//         const UUID = uuidv4()
//         return new Promise(resolve => {
//             classifierWebWorker.addEventListener("message", event => {
//                 if (event.data.uuid === UUID) {
//                     resolve(event)
//                 }
                
//             }, {once: true})
//             classifierWebWorker.postMessage({action, ...data, uuid:UUID});
//         })
        
//     }
    

// //     const handleUpload = async (uploadEventObject) => {

        
//         console.log("start object data parsing")
//         const fileListObject = uploadEventObject.target.files
//         dataWorkerActionPromise("init", {fileListObject})
//             .then(() => {
//                 return dataWorkerActionPromise("getTrainingObject", {})
//             })
//             .then((event) => {
//                 const {trainingObject} = event.data
//                 return classifierWorkerActionPromise("train", {trainingObject})
//             })
//             .then(() => {
//                 setFetchEnabled(true)
//             })
        
// //     }

//     const handleWorkerFetch = () => {
//         console.log("fetch test")
//         dataWebWorker.postMessage({action:"printObjectDataRow", index: 500})
        
        
//         // workerGetRowPromise(dataWebWorker, 5).then(row=>{console.timeEnd("fetch row"); console.log(row)})
        
//     }
//     const handleFetch = () => {

//         dataWebWorker.postMessage({action: "sendObjectData"})
//         dataWebWorker.addEventListener("message", event => {
//             if (event.data.action === "objectData") {
//                 console.log(event.data.objectData[0])
//             }
//         })
//         // workerGetRowPromise(dataWebWorker, 5).then(row=>{console.timeEnd("fetch row"); console.log(row)})
        
// //     }

//     const handlePredictAll = () => {
//         console.log("train and predict test")
//         classifierWebWorker.postMessage({action: "trainAndPredict"})
//     }

//     const handleFetchType = async function(fetchType) {

//         const sampledcellPairs = await dataWorkerActionPromise("getSampledCellPairs", {number: 100})

//         switch(fetchType) {
//             case "Random":
//                 break;
//             case "Positive":
//                 break;
//             case "Negative":
//                 break;
//         }
//     }


    
//     return (
//         <div style={{resize: 'horizontal'}}>
//         <Button disabled={!fetchEnabled} onClick={()=>handleFetchType("Random")}>Fetch Random</Button>
//         <Button disabled={!fetchEnabled} onClick={()=>handleFetchType("Positive")}>Fetch Positive</Button>
//         <Button disabled={!fetchEnabled} onClick={()=>handleFetchType("Negative")}>Fetch Negative</Button>
//         <Button disabled={!fetchEnabled} onClick={handleFetch}>Train</Button>
//         <Button disabled={!fetchEnabled} onClick={handleFetch}>Evaluate</Button>
//         <Button disabled={!fetchEnabled} onClick={handleFetch}>Download</Button>
//         <Button disabled={!fetchEnabled} onClick={handleFetch}>Upload</Button>
//         <Button disabled={!fetchEnabled} onClick={handleWorkerFetch}>worker fetch line</Button>
//         <Button disabled={!fetchEnabled} onClick={handlePredictAll}>Predict All Worker</Button>
//         <Button endIcon={<CircularProgress/>} variant="contained" component="label" onClick={()=>console.log("Upload!")}> 
//             Upload
//             <input  type="file"
//                     hidden webkitdirectory="true"
//                     mozdirectory="true"
//                     msdirectory="true"
//                     odirectory="true"
//                     directory="true"
//                     multiple
//                     onChange = {(eventObject)=>{handleUpload(eventObject)}}   
//             />
//         </Button>
//         <div ref={trainingAccuracyCanvasParentRef}></div>
//         <div ref={trainingLossCanvasParentRef}></div>

//     </div>

//      );
//  }

// // export default TestUI;

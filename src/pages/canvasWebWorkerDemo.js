
import React from 'react';
import {Button, CircularProgress}from '@material-ui/core'; 
import "bootstrap/dist/css/bootstrap.css";
import UploadHandler from '../classes/UploadHandler'
import Classifier from '../classes/Classifier'
import * as tfvis from '@tensorflow/tfjs-vis'
import { v4 as uuidv4 } from 'uuid';
  import "../dndstyles.css";



function TestUI(){

    const [buttonsEnabled, setButtonsEnabled] = React.useState(false)
    const [canvasWebWorker, setCanvasWebWorker] = React.useState(null)
    const [dataWebWorker, setDataWebWorker] = React.useState(null)
    const [blobURL, setBlobURL] = React.useState(undefined)
    const [fileListObject, setFileListObject] = React.useState(null)

    React.useEffect(() => {

        const dataToCanvasWorkerChannel = new MessageChannel();

        const canvasWebWorker = new Worker('../canvasWorker.js')
        canvasWebWorker.addEventListener("error", event => {
            console.log('[canvasWebWorker] Error', event.message, event);
        });   
        canvasWebWorker.postMessage({action: "connectToDataWorker"}, [dataToCanvasWorkerChannel.port1])    
        setCanvasWebWorker(canvasWebWorker)

        const dataWebWorker = new Worker('../dataWorker.js')
        dataWebWorker.addEventListener("error", event => {
            console.log('[dataWebWorker] Error', event.message, event);
        });     
        dataWebWorker.postMessage({action: "connectToCanvasWorker"}, [dataToCanvasWorkerChannel.port2])
        setDataWebWorker(dataWebWorker)

    }, [])


    // const canvasWorkerActionPromise = async (action, data) => {
    //     console.log(data)
    //     const UUID = uuidv4()
    //     return new Promise(resolve => {
    //         canvasWebWorker.addEventListener("message", event => {
    //             if (event.data.uuid === UUID) {
    //                 resolve(event)
    //             }
                
    //         }, {once: true})
    //         canvasWebWorker.postMessage({action, ...data, uuid:UUID});
    //     })
        
    // }

    const canvasWorkerActionPromise = function( action, data) {
        console.log("workerPortActionPromise enter")
        const UUID = uuidv4()
      
        return new Promise (resolve => {
          let eventHandler = (event) => {
            if (event.data.uuid === UUID) {
                canvasWebWorker.removeEventListener('message', eventHandler);
                resolve(event)
            }
          }
          canvasWebWorker.addEventListener('message', eventHandler)
          
          canvasWebWorker.postMessage({action, ...data, uuid:UUID})
        })
        
      }

    const workerActionPromise = (worker, action, data) => {
        const UUID = uuidv4()
        return new Promise(resolve => {
            worker.addEventListener("message", event => {
                if (event.data.uuid === UUID) {
                    resolve(event)
                }
                
            }, {once: true})
            worker.postMessage({action, ...data, uuid:UUID});
        })
        
    }

    const handleCanvasCall = async function() {
        canvasWorkerActionPromise("test", {fileListObject}).then((event)=>{
            console.log(URL.createObjectURL(event.data.blob)); 
            setBlobURL(URL.createObjectURL(event.data.blob))
        })

        canvasWorkerActionPromise('get', {
            getType: 'blobUrlsFromCellPairs', 
            getArgs: {cellPairs: [{ImageNumber: 1, ObjectNumber: 1}]}
        })
            .then(event => {
                console.log(event)
                setBlobURL(event.data.blobUrls[0])
            })
    }

    const handleUpload = function(eventObject) {

        workerActionPromise(dataWebWorker, 'init', {fileListObject:eventObject.target.files})
            .then(() => {
                setButtonsEnabled(true)
            })

        setFileListObject(eventObject.target.files)
        
    }


    

    
    return (
        <div style={{resize: 'horizontal'}}>
        <Button disabled={!buttonsEnabled} onClick={handleCanvasCall}>test offscreen canvas</Button>
        <img width={100} height={100} src={blobURL}></img>
        <Button endIcon={<CircularProgress/>} variant="contained" component="label" onClick={()=>console.log("Upload!")}> 
            Upload
            <input  type="file"
                    hidden webkitdirectory="true"
                    mozdirectory="true"
                    msdirectory="true"
                    odirectory="true"
                    directory="true"
                    multiple
                    onChange = {(eventObject)=>{handleUpload(eventObject)}}   
            />
        </Button>

    </div>

    );
}





export default TestUI; 

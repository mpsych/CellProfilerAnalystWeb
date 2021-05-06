
import React from 'react';
import {Button, CircularProgress}from '@material-ui/core'; 
import "bootstrap/dist/css/bootstrap.css";
import UploadHandler from '../classes/UploadHandler'
import { v4 as uuidv4 } from 'uuid';
  import "../dndstyles.css";



function TestUI(){
    
    const [dataWebWorker, setDataWebWorker] = React.useState(null)
    const [classifierWebWorker, setClassifierWebWorker] = React.useState(null)
    const [fetchEnabled, setFetchEnabled] = React.useState(false)

    React.useEffect(() => {
        
        const workerChannel = new MessageChannel();

        const dataWebWorker = new Worker('../dataWorker.js')
        dataWebWorker.addEventListener("message", event => {
            switch(event.data.action) {
                case "init":
                    setFetchEnabled(true)
                    break;
                
            }
        })
        dataWebWorker.addEventListener("error", event => {
            console.log('[dataWebWorker] Error', event.message, event);
        });
        dataWebWorker.postMessage({action: "init"})
        dataWebWorker.postMessage({action: "connectToClassifierWorker"}, [workerChannel.port1])
        setDataWebWorker(dataWebWorker)


        const classifierWebWorker = new Worker('../classifierWorker.js')
        classifierWebWorker.addEventListener("message", event => {
            switch(event.data.action) {
                
            }
        })
        classifierWebWorker.addEventListener("error", event => {
            console.log('[classifierWebWorker] Error', event.message, event);
        });
        classifierWebWorker.postMessage({action: "init"})
        classifierWebWorker.postMessage({action: "connectToDataWorker"}, [workerChannel.port2])
        setClassifierWebWorker(classifierWebWorker)



    }, [])

    const workerGetRowPromise = async (worker, index) => {
        return new Promise(resolve => {
            const UUID = uuidv4()

            // listener which resolves the promise only with the get row command and the correct uuid
            const onGetRowListener = (event) => {
                if (event.data.action === "get_row" && event.data.uuid === UUID) {
                    resolve(event.data.row)
                }
                
            }
            //call this listener when comes back, {once} means listener should remove itself when done
            worker.addEventListener("message", onGetRowListener, {once: true}) 
            // start the async get row call in the background, 
            // the uuid is there to make sure its the right one even when things are happening in parallel
            worker.postMessage({action: "get_row", index, uuid:UUID});
        })  
    }

    

    const handleUpload = async (uploadEventObject) => {


        console.log("start object data parsing")
        uploadWebWorker.postMessage({action: "init", fileListObject:uploadEventObject.target.files});
        
        
    }

    const handleFetch = () => {
        console.time("fetch row")
        workerGetRowPromise(uploadWebWorker, 5).then(row=>{console.timeEnd("fetch row"); console.log(row)})
        
    }


    
    return (
        <div style={{resize: 'horizontal'}}>
        <Button disabled={!fetchEnabled} onClick={handleFetch}>Fetch Line</Button>
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


import React from 'react';
import {Button, CircularProgress}from '@material-ui/core'; 
import "bootstrap/dist/css/bootstrap.css";
import UploadHandler from '../classes/UploadHandler'

  import "../dndstyles.css";



function TestUI(){
    
    const [uploadWebWorker, setUploadWebWorker] = React.useState(null)

    React.useEffect(() => {
        

        const webworker = new Worker('../worker.js')

        webworker.addEventListener("message", event => {
            if (event.data.action === 'get_row') {
                console.log("got here3")
                console.timeEnd("get_row")
            }
            console.log(event.data)
            });

        webworker.addEventListener("error", event => {
            console.log('[UploadWebWorker] Error', event.message, event);
            });
            
        setUploadWebWorker(webworker)
        console.log("created upload webworker", webworker)      
    }, [])

    

    const handleUpload = async (uploadEventObject) => {

        // const uploadHandler = new UploadHandler(uploadEventObject)
        // const uploadReturnObject = await uploadHandler.getDataHandlerandStartingTrainingSet();
        console.log("start object data parsing")
        // const serialized_uploadEventObject = JSON.parse(JSON.stringify(uploadEventObject));
        uploadWebWorker.postMessage({action: "init", fileListObject:uploadEventObject.target.files});
        
        
    }

    const handleFetch = () => {
        console.log("got here2")
        console.time("get_row")
        uploadWebWorker.postMessage({action: "get_row"});
        
    }


    
    return (
        <div style={{resize: 'horizontal'}}>
        <Button onClick={handleFetch}>Fetch Line</Button>
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
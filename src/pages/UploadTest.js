import React from 'react';
import {Button}from '@material-ui/core'; 
import UploadHandler from '../classes/UploadHandler'
import UserUploadFileHandler from '../classes/UserUploadFileHandler'
import {Redirect, useHistory, Link} from 'react-router-dom';


function UploadTest(){
    const [userUploadFileHandler, setUserUploadFileHandler] = React.useState(null)
    const [featuresToUse, setFeaturesToUseState] = React.useState(null)
    const [trainingObject, setTrainingObject] = React.useState(null)
    const [dataProvider, setDataProvider] = React.useState(null)

    let uploadComplete = false
   
    const handleUpload = async (eventObject) => {
        console.log(uploadComplete )
        // setUploadButtonEnabled(false)
        const userUploadFileHandler = new UserUploadFileHandler(eventObject)
        setUserUploadFileHandler(userUploadFileHandler)

        const uploadHandler = new UploadHandler(eventObject)
        const uploadReturnObject = await uploadHandler.getDataHandlerandStartingTrainingSet();

        const dataProvider = uploadReturnObject.data_provider
        setDataProvider(dataProvider)
        const trainingTable = uploadReturnObject.training_data.training_table
        const trainingDataTable = trainingTable.getDataColumnsPaired()

        const trainingLabels = trainingTable.getTrainingLabels()
        const initialTrainingData = trainingDataTable.map(row_object => {
            const ObjectNumber = row_object['objectnum']
            const ImageNumber = row_object['imagenum']
            return dataProvider.getRow('object_data', {ObjectNumber, ImageNumber})
        })
        const totalFeatures = uploadReturnObject.training_data.features
        const tempFeaturesToUse = totalFeatures.filter((elem)=>!elem.includes("Location") && (elem !== "ObjectNumber") && (elem !== "ImageNumber"))
        setFeaturesToUseState(tempFeaturesToUse)
        console.log("finished data initialization")
        const initialTrainingObject = {
            classifierType: "LogisticRegression",
            trainingData: initialTrainingData,
            trainingLabels: trainingLabels,
            featuresToUse: tempFeaturesToUse
        }
        setTrainingObject(initialTrainingObject)
        // console.log("starting initial training")
        // const newClassifierManager = new ClassifierManager(dataProvider, initialTrainingObject)
        
        // setClassifierManager(newClassifierManager)

        // setFetchButtonEnabled(true)
        // setTrainButtonEnabled(true)
        // setDownloadButtonEnabled(true)
        
        
        console.log("finished upload")
        uploadComplete = true 
        console.log(uploadComplete )
    }
    
 

  
     //()=>console.log("Upload!")

    return(
        <div>
        <Button  variant="contained" component="label" onClick={()=>console.log("Upload!")}> 
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

export default UploadTest; 
import React, {useRef} from 'react';
import {Button, Grid}from '@material-ui/core'; 
import "bootstrap/dist/css/bootstrap.css";

import UploadHandler from '../../classes/UploadHandler'
import UserUploadFileHandler from '../../classes/UserUploadFileHandler'
import {Classifier} from '../../classes/Classifier'
import CircularProgress from '@material-ui/core/CircularProgress';
import {test} from '../../classes/test'

  

function Example(){

    console.log(test(3))
    
    const [loadingUpload, setLoadingUpload] = React.useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [dataProvider, setDataProvider] = React.useState(null)

    // var classifierManager = null;
    // const [classifierManager, setClassifierManager] = React.useState(null)
    const [trainingObject, setTrainingObject] = React.useState(null)
    const [featuresToUse, setFeaturesToUseState] = React.useState(null)

    const [uploadButtonEnabled, setUploadButtonEnabled] = React.useState(true)
    const [classifier, setClassifier] = React.useState(null)
    const N = 20
    const [exampleImageSource, setExampleImageSource] = React.useState()

    const confusionCanvasRef = React.useRef(null)


    const handleUpload = async (eventObject) => {
        setLoadingUpload(true)
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
        console.log("start initial train")
        const newClassifier = new Classifier(initialTrainingObject)
        await newClassifier.trainPromise()
        setClassifier(newClassifier)
        console.log("end initial train")

        const canvasElement = confusionCanvasRef.current
        const dataURL = await newClassifier.TrainingDataConfusionMatrixDataURLPromise(['Negative', 'Positive'], canvasElement)
        setExampleImageSource(dataURL)
        console.log(dataURL)
        console.log("finished upload")
        setLoadingUpload(false)
    }




    
    return (
        <div style={{resize: 'horizontal'}}>
    
        <Grid container justify="center" spacing={2} style={{marginBottom: 15}}>
       
        <Grid key={1} item>
        <Button  endIcon={loadingUpload? <CircularProgress></CircularProgress> : null} disabled={!uploadButtonEnabled} variant="contained" component="label" onClick={()=>console.log("Upload!")}> 
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
        </Grid>
        <img width={100} height={100}  src={exampleImageSource}></img>
        <canvas ref={confusionCanvasRef} width={100} height={100} id="processingCanvas"></canvas>
    </Grid>

        
    </div>

    );
}





export default Example; 
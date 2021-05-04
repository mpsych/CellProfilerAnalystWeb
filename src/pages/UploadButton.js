import React from 'react';
import {Button}from '@material-ui/core'; 
import UploadHandler from '../classes/UploadHandler'
import UserUploadFileHandler from '../classes/UserUploadFileHandler'

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';



const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    buttonSuccess: {
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[700],
      },
    },
    fabProgress: {
      color: green[500],
      position: 'absolute',
      top: -6,
      left: -6,
      zIndex: 1,
    },
    buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
    
  }));

function UploadButton(){
    const [userUploadFileHandler, setUserUploadFileHandler] = React.useState(null)
    const [featuresToUse, setFeaturesToUseState] = React.useState(null)
    const [trainingObject, setTrainingObject] = React.useState(null)
    const [dataProvider, setDataProvider] = React.useState(null)
    const [fetchButtonEnabled, setFetchButtonEnabled] = React.useState(false)
    const [trainButtonEnabled, setTrainButtonEnabled] = React.useState(false)
    const [evaluateButtonEnabled, setEvaluateButtonEnabled] = React.useState(false)
    const [downloadButtonEnabled, setDownloadButtonEnabled] = React.useState(false)
    const [uploadButtonEnabled, setUploadButtonEnabled] = React.useState(true)
    const [uploading, setUploading] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    
    const classes = useStyles();
    const buttonClassname = clsx({
      [classes.buttonSuccess]: success,
    });

   
    const handleUpload = async (eventObject) => {
        setUploading(true)
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

        setFetchButtonEnabled(true)
        setTrainButtonEnabled(true)
        setDownloadButtonEnabled(true)
        
        
        console.log("finished upload")
        setUploading(false)
        setSuccess(true)
    
    }
  

    return(
        <div>
          
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Fab
          aria-label="save"
          color="primary"
          component="label"
          className={buttonClassname}
        >
        
          {success ? <CheckIcon /> : <CloudUploadIcon />}
          <input  type="file"
                hidden webkitdirectory="true"
                mozdirectory="true"
                msdirectory="true"
                odirectory="true"
                directory="true"
                multiple
                onChange = {(eventObject)=>{handleUpload(eventObject)}}  
               
        />
        </Fab>
        {uploading && <CircularProgress size={68} className={classes.fabProgress} />}
      </div>
      <CircularProgress />
      
    </div>



     </div>
     
     );
}

export default UploadButton; 
import React from 'react';
import { Row, Col, Container} from "reactstrap";
import {Box, Button, Grid, IconButton, Menu, MenuItem, Card}from '@material-ui/core'; 
import logo from '../cpa_logo(blue).svg';
import {Image, Dropdown, DropdownButton} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import UploadHandler from '../classes/UploadHandler'
import {ClassifierManager} from '../classes/ClassifierManager'
import {ImageHandler}  from '../classes/ImageHandler'
import UserUploadFileHandler from '../classes/UserUploadFileHandler'
import {ImageGridManager}  from '../classes/imGridManager'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';
//import UploadButton from './UploadButton'

import UIEvaluate from './AbbyUIButtons/UIEvaluateButton'
import UIScoreAll from './AbbyUIButtons/UIScoreAllButton'


import {
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap,
    move
  } from "react-grid-dnd";
  
  import "../dndstyles.css";
import { truncatedNormal } from '@tensorflow/tfjs-core';
import UploadButton from './UploadButton';


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


function TestUIMVP(){
    
    
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [dataProvider, setDataProvider] = React.useState(null)

    // var classifierManager = null;
    // const [classifierManager, setClassifierManager] = React.useState(null)
    const [trainingObject, setTrainingObject] = React.useState(null)
    const [fileListObject, setFileListObject] = React.useState(null)
    const [tileState, setTileState] = React.useState( constructTileState([]) );
    const [imageGridManager, setImageGridManager] = React.useState(null)
    const [lastFetchState, setLastFetchState] = React.useState(null)
    const [featuresToUse, setFeaturesToUseState] = React.useState(null)

    const [fetchButtonEnabled, setFetchButtonEnabled] = React.useState(false)
    const [trainButtonEnabled, setTrainButtonEnabled] = React.useState(false)
    const [evaluateButtonEnabled, setEvaluateButtonEnabled] = React.useState(false)
    const [downloadButtonEnabled, setDownloadButtonEnabled] = React.useState(false)
    const [uploadButtonEnabled, setUploadButtonEnabled] = React.useState(true)
    const [scoreAllButtonEnabled, setscoreAllButtonEnabled] = React.useState(false)
    const [uploading, setUploading] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    const [fetching, setFetching] = React.useState(false)
    const [openFetchDropdown, setOpenFetchDropdown] = React.useState(false);
    
    const classes = useStyles();
    const buttonClassname = clsx({
      [classes.buttonSuccess]: success,
    });

    const N = 20

    const handleClickFetchDropDown = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseFetchDropDown = (fetchType) => {
        setAnchorEl(null)
         if (fetchType !== undefined) {
            handleFetch(fetchType)
         }
         
    };

    const disableIterationButtons = () => {
      setFetchButtonEnabled(false)
      setTrainButtonEnabled(false)
      setDownloadButtonEnabled(false)
      setEvaluateButtonEnabled(false)

    }
    const enableIterationButtons = () => {
      setFetchButtonEnabled(true)
      setTrainButtonEnabled(true)
      setDownloadButtonEnabled(true)
      setEvaluateButtonEnabled(true)

    }

    const handleFetch = async (fetchType) => {
      setFetching(true)
      disableIterationButtons()
      const emptyTileState = { unclassified: [], positive: [], negative: []}
      setTileState(emptyTileState)
      const classifierManager = new ClassifierManager(dataProvider, trainingObject)
      await classifierManager.initTrainPromise()
      setLastFetchState(fetchType)
      const classedCellPairObjects = classifierManager.fetchUpToNCellPairsByClass(fetchType, N)
      const ih = new ImageHandler(fileListObject, dataProvider)
      const dataURLS = await ih.getObjsToURLs(classedCellPairObjects)
      const newTileState = constructTileState(dataURLS)
      setTileState(newTileState)
      setImageGridManager(new ImageGridManager(classedCellPairObjects, dataURLS))
      enableIterationButtons()
      setImageGridManager(classedCellPairObjects, dataURLS)
      enableIterationButtons()
      setFetching(false)
      return
    }
    


  const handleTrain = async () => {

    disableIterationButtons()

      const negativeIDs = tileState.negative.map(item => item.id)
      const positiveIDs = tileState.positive.map(item => item.id)
      console.log(negativeIDs, tileState)
      imageGridManager.setClassByIndexArray('negative', negativeIDs)
      imageGridManager.setClassByIndexArray('positive', positiveIDs)

      const negativeCellPairs = imageGridManager.getPairsByClass('negative')`1`
      const positiveCellPairs = imageGridManager.getPairsByClass('positive')
 
      const negativeObjectDataRows = negativeCellPairs.map(cellPair => dataProvider.getRow('object_data', {ImageNumber: cellPair.ImageNumber, ObjectNumber: cellPair.ObjectNumber}))
      const positiveObjectDataRows = positiveCellPairs.map(cellPair => dataProvider.getRow('object_data', {ImageNumber: cellPair.ImageNumber, ObjectNumber: cellPair.ObjectNumber}))
      const trainingDataAddition = [...negativeObjectDataRows, ...positiveObjectDataRows]

      const negativeLabels = new Array(negativeObjectDataRows.length).fill(0)
      const positiveLabels = new Array(positiveObjectDataRows.length).fill(1)
      const trainingLabelsAddition = negativeLabels.concat(positiveLabels)

      const UpdatedTrainingObject = {
        classifierType: "LogisticRegression",
        trainingData: [...trainingDataAddition, ...trainingObject.trainingData],
        trainingLabels: [...trainingLabelsAddition, ...trainingObject.trainingLabels],
        featuresToUse: featuresToUse
      }
      console.log(UpdatedTrainingObject)
      setTrainingObject(UpdatedTrainingObject)
      // const newClassifierManager = new ClassifierManager(dataProvider, UpdatedTrainingObject)
      
      
      // setClassifierManager(newClassifierManager)

      const clearedTileState = { unclassified: tileState.unclassified, positive: [], negative: []}
      setTileState(clearedTileState)
      console.log("finished train")
      enableIterationButtons()
    
  }

    const handleUpload = async (fileListObject) => {
        setUploadButtonEnabled(false)
        setFileListObject(fileListObject)
        const uploadHandler = new UploadHandler(fileListObject)
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
        setEvaluateButtonEnabled(true)
        
        
        console.log("finished upload")

    setTrainingObject(initialTrainingObject)
    // console.log("starting initial training")
    // const newClassifierManager = new ClassifierManager(dataProvider, initialTrainingObject)
    
    // setClassifierManager(newClassifierManager)

    setFetchButtonEnabled(true)
    setTrainButtonEnabled(true)
    setDownloadButtonEnabled(true)
    setscoreAllButtonEnabled(true)
    setEvaluateButtonEnabled(true)
    setUploadButtonEnabled(false)
      
    console.log("finished upload")
    setUploading(false)
    setSuccess(true)

  }
    const handleDownload = async () => {
      disableIterationButtons()
      const classifierManager = new ClassifierManager(dataProvider, trainingObject)
      await classifierManager.initTrainPromise()
      classifierManager.userDownloadClassifierSpecPromise()
      enableIterationButtons()
    }

    
    function constructTileState(dataURLs) {
        return {
            unclassified: dataURLs.map((dataURL, idx, info) => {return {id: idx, address: dataURL, info: "cell info, biology stuff"}}),  
            positive: [],
            negative: []
        };
    }

    function onChange(sourceId, sourceIndex, targetIndex, targetId) {
        if (targetId) {
          const result = move(
            tileState[sourceId],
            tileState[targetId],
            sourceIndex,
            targetIndex
          );
          return setTileState({
            ...tileState,
            [sourceId]: result[0],
            [targetId]: result[1]
          });
        }
    
        const result = swap(tileState[sourceId], sourceIndex, targetIndex);
        return setTileState({
          ...tileState,
          [sourceId]: result
        });
      }
    
      const handleClickOpenFetchDropdown = () => {
        setOpenFetchDropdown(true);
      };
   
      const handleCloseFetchDropdown = () => {
        setOpenFetchDropdown(false);
      };

    return (
       

        <GridContextProvider onChange={onChange}>
             
        <div style={{ overflowX:"hidden", hieght: "100%", width: "100%" }}>
      
        <Row>
        <Image src={logo} style={{marginLeft:"10%", height:"30%", width:"25%",position:"relative", maxHeight:"125px", marginBottom:"1%"}}></Image>
       
        <Col style = {{left:'40%'}}>
        <div className={classes.root}>
      <div className={classes.wrapper}>
       <Tooltip title="Load Data" aria-label="load data">
        <Fab
          aria-label="save"
          color="primary"
          component="label"
          className={buttonClassname}
          style =  {{height: '5vw', width: '5vw'}}
        >
        
          {success ? <CheckIcon style =  {{ hieght: "50%", width: "50%"}}/> : <CloudUploadIcon style =  {{ hieght: "50%", width: "50%"}}/>}
          <input  type="file"
                hidden webkitdirectory="true"
                mozdirectory="true"
                msdirectory="true"
                odirectory="true"
                directory="true"
                multiple
                onChange = {(eventObject)=>{handleUpload(eventObject)}}  
                disabled={!uploadButtonEnabled} 
               
        />
        </Fab>
        </Tooltip>
        {/* size={68}  */}
        {uploading && <CircularProgress className={classes.fabProgress} style={{height: '6vw', width: '6vw', marginTop:"4%", marginRight:"4%"}}/>}
      </div>  
    </div>
        </Col>
        <Col style = {{left: '15%', marginTop: '.75%'}}>
        <Tooltip title="Download" aria-label="download">
        <Fab 
         aria-label="save"
         color="primary"
         component="label"
        disabled={!downloadButtonEnabled} 
        onClick={handleDownload}
        style =  {{height: '5vw', width: '5vw'}}
        > <SaveAltIcon style =  {{ hieght: "50%", width: "50%"}} /></Fab> 
        </Tooltip>
        </Col>
       
        </Row>
        <Row>
        
        <Grid container justify="center" spacing={2} style={{marginBottom: 15}}>
       
        <Grid key={0} item>
            <Button disabled={!fetchButtonEnabled} variant="contained" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickFetchDropDown}>
            Fetch
            </Button>
            <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseFetchDropDown}
            >
            <MenuItem onClick={()=>handleCloseFetchDropDown("random")}>Random</MenuItem>
            <MenuItem onClick={()=>handleCloseFetchDropDown("positive")}>Positive</MenuItem>
            <MenuItem onClick={()=>handleCloseFetchDropDown("negative")}>Negative</MenuItem>
            <MenuItem onClick={handleClickOpenFetchDropdown}>By Image</MenuItem>
           
                <Dialog
            open={openFetchDropdown}
            onClose={handleCloseFetchDropdown}
        
            >
            <DialogTitle>Fetch By Image</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Select the image number you would like to fetch from. 
            </DialogContentText>
            <form  noValidate >
                <FormControl >
                <InputLabel >Image</InputLabel>
                <Select
                    autoFocus>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                    <MenuItem value="4" >4</MenuItem>
                    <MenuItem value="5" >5</MenuItem>
                </Select>
                </FormControl>
            </form>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleCloseFetchDropdown} color="primary">
                Close
            </Button>
            </DialogActions>
        </Dialog>
            
            </Menu>
    </Grid>


        <Grid key={1} item>
            {/* style = {{height: "5vw", width:"10vw", minHeight:2, maxHeight: 35, maxwidth: 50, fontSize: "max(1.5vw, 20)"}}  */}
        <Button disabled={!trainButtonEnabled} variant="contained" onClick={handleTrain}>Train</Button>
        </Grid>

        <Grid key={2} item>
         {/* <Button disabled={!evaluateButtonEnabled} variant="contained" onClick={()=>{}}>Evaluate</Button>  */}
          {/* TODO: need to fix button disabled */}
          <UIEvaluate></UIEvaluate>
        </Grid>

        <Grid key={3} item>
        {/* <Button  disabled={!scoreAllButtonEnabled} variant="contained" onClick={()=>{}}>Score All</Button> */}
          {/* TODO: need to fix button disabled */}
          <UIScoreAll></UIScoreAll>
        </Grid>
        
    </Grid>
    </Row>

  
        <div>
        
        
        <label style = {{textAlign:"left", backgroundColor: 'white', paddingLeft: "10%", marginBottom:"0.5%", userSelect: "none"} }>Unclassified </label>
      
        <div>
        <GridDropZone
             className="dropzone "
            id="unclassified"
            boxesPerRow={8}
            rowHeight={80}
            style={{height: "20vw", maxHeight: 200, minHeight:150, marginBottom:10, marginLeft: "10%", width:"80%"}}
          >   
            {!fetching ? tileState.unclassified.map(item => (
              <GridItem className= "hoverTest"  style={{height:"10vw", width: "10vw", minHeight:80, minWidth: 80, maxHeight: 105, maxWidth: 105, padding:10}} key={item.id}>
                <div className="grid-item" >
                    <div className="grid-item-content" style = {{backgroundImage:  `url(${item.address})`}} >
                    <span className= "hoverText">{item.info}</span>
                        </div> 

                </div>
              </GridItem>
            )) : <CircularProgress style= {{hieght:"7%", width:"7%", marginTop: "8%", marginLeft: "45%"}}/> } 
        
          </GridDropZone>
          </div>
         
        
        <Row>
       
          <label style = {{textAlign:"left", backgroundColor: 'white', paddingLeft: "11%", userSelect: "none", marginBottom:"0.5%", marginTop:0} }>Positive</label> 
    
        
          <label style = {{textAlign:"left", backgroundColor: 'white', paddingRight: "8%", userSelect: "none", margin: "auto",  marginBottom:"0.5%", marginTop:0} }>Negative</label>
       
          </Row>
         
         <Row>

          <GridDropZone
            className="dropzone positive"
            id="positive"
            boxesPerRow={4}
            rowHeight={80}
            style={{height: "20vw", maxHeight: 200, minHeight:150}}
          >
            
            {tileState.positive.map(item => (
              <GridItem className= "hoverTest" style={{height:"10vw", width: "10vw", minHeight: 80, minWidth: 80, maxHeight: 105, maxWidth: 105, padding:10}} key={item.id}>
                <div className="grid-item"> 
                    <div className="grid-item-content" style = {{backgroundImage: `url(${item.address})`}}>
                    <span className= "hoverText">{item.info}</span>
                        </div>  
                </div>
              </GridItem>
            ))}
          </GridDropZone>
   
      
          <GridDropZone
            className="dropzone negative"
            id="negative"
            boxesPerRow={4}
            rowHeight= {80}
            style={{height: "20vw", maxHeight: 200, minHeight:150}}
          >
            {tileState.negative.map(item => (
              <GridItem className= "hoverTest" style={{height:"10vw", width: "10vw", minHeight: 80, minWidth: 80, maxHeight: 105, maxWidth: 105, padding: 10}} key={item.address}>
                <div className="grid-item">
                <div className="grid-item-content" style = {{backgroundImage: `url(${item.address})`}}>
                <span className= "hoverText">{item.info}</span>
                        </div>      
                </div>
              </GridItem>
            ))}
          </GridDropZone>

     
      
        </Row>
        </div>
      
 
    </div>
    </GridContextProvider>

    );
}






export default TestUIMVP; 
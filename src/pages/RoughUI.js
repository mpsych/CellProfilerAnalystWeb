import React from 'react';
import { Row, Col, Container} from "reactstrap";
import {Box, Button, Grid, IconButton, Menu, MenuItem}from '@material-ui/core'; 
import logo from '../CPA_newlogo.png';
import {Image, Dropdown, DropdownButton} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import BelladndTest from './BelladndTest'

import UploadHandler from '../classes/UploadHandler'
import {ClassifierManager} from '../classes/ClassifierManager'
import {ImageProvider} from '../classes/ImageProvider.js';
import UserUploadFileHandler from '../classes/UserUploadFileHandler'

function TestUI(){
    
    
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [dataProvider, setDataProvider] = React.useState(null)

    // var classifierManager = null;
    const [classifierManager, setClassifierManager] = React.useState(null)
    const [userUploadFileHandler, setUserUploadFileHandler] = React.useState(null)
    const [dataURLs, setDataURLs] = React.useState(undefined)
    const N = 20

    const handleClickFetchDropDown = (event) => {
        setAnchorEl(event.currentTarget);
 
    };

    const handleCloseFetchDropDown = (fetchType) => {
        setAnchorEl(null);
        if (fetchType !== undefined) {
            handleFetch(fetchType)
        }
    };

    const handleFetch = (fetchType) => {
        console.log("fetch " + fetchType)
        const classedCellPairObjects = classifierManager.fetchUpToNCellPairsByClass(fetchType, N)
        const imageProvider = new ImageProvider();
        
        if (fetchType === "random") {
            classedCellPairObjects.map(CellPair => {
                const channelFileNames = dataProvider.returnAllImgFileNames(CellPair.ImageNumber)
                const channelFiles = channelFileNames.map(name => { //Alternatively, we could have this.dp.returnAllImgPromisesPerImg({'ImageNumber': 2}, fh)
                    return userUploadFileHandler.findFile(name)       // and abstract from 8-17 or more
                })
                const promiseImages = channelFiles.map(file => {
                    const image =  userUploadFileHandler.fileReaderPromiseImage(file)
                    return image;    
                })
                Promise.all(promiseImages)
                    .then(images => {
                        const coords = dataProvider.getCordsforCellDisplay(CellPair)
                        return imageProvider.getDataURLPromise(images, coords);   //The only method of imageprovider. If cords is left blank, it will produce a whole image. Should be
                    })                                                //static class or function
                    .then(dataURLs => {
                        console.log("finished fetch random")
                        setDataURLs(dataURLs)
                    })
            })
        }

    }

    const handleUpload = async (eventObject) => {

        const userUploadFileHandler = new UserUploadFileHandler(eventObject)
        setUserUploadFileHandler(userUploadFileHandler)
        const uploadHandler = new UploadHandler(eventObject)
        const uploadReturnObject = await uploadHandler.getDataHandlerandStartingTrainingSet();

        console.log(uploadReturnObject)
        const dataProvider = uploadReturnObject.data_provider
        setDataProvider(dataProvider)
        const trainingTable = uploadReturnObject.training_data.training_table
        const trainingDataTable = trainingTable.getDataColumnsPaired()
        console.log(trainingTable)
        const trainingLabels = trainingTable.getTrainingLabels()
        const initialTrainingData = trainingDataTable.map(row_object => {
            const ObjectNumber = row_object['objectnum']
            const ImageNumber = row_object['imagenum']
            return dataProvider.getRow('object_data', {ObjectNumber, ImageNumber})
        })
        const totalFeatures = uploadReturnObject.training_data.features
        const featuresToUse = totalFeatures.filter((elem)=>!elem.includes("Location") && (elem !== "ObjectNumber") && (elem !== "ImageNumber"))
        console.log("finished data initialization")
        const initialTrainingObject = {
            classifierType: "LogisticRegression",
            trainingData: initialTrainingData,
            trainingLabels: trainingLabels,
            featuresToUse: featuresToUse
        }
        console.log("starting initial training")
        const classifierManager = new ClassifierManager(dataProvider, initialTrainingObject)
        setClassifierManager(classifierManager)

        await classifierManager.initTrainPromise()

        console.log("finished upload")
    }
    
    return (
        <div style={{resize: 'horizontal'}}>
    
        <Row>
       
        
        <Col>
        <Image src={logo} style={{marginRight:"40%", height:'90px'}}></Image>
        </Col>

        <Col >
        <IconButton style={{color: "black", marginLeft:"50%"}}> <SaveAltIcon /></IconButton> 
        </Col>


        </Row>
        <Row>
        
        <Grid container justify="center" spacing={2} style={{marginBottom: 15}}>
       
        <Grid key={0} item>
        {/* <DropdownButton variant="secondary" title= "Fetch">
        
         <Dropdown.Item >Positive</Dropdown.Item>
         <Dropdown.Item >Negative</Dropdown.Item>
         <Dropdown.Item >Random</Dropdown.Item>
        
        </DropdownButton> */}
            <Button variant="contained" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickFetchDropDown}>
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
            </Menu>
    </Grid>


        <Grid key={1} item>
        <Button variant="contained" onClick={()=>{}}>Train</Button>
        </Grid>

        <Grid key={2} item>
        <Button variant="contained" onClick={()=>{}}>Evaluate</Button>
        </Grid>
        <Grid key={3} item>
        <Button variant="contained" component="label" onClick={()=>console.log("Upload!")}> 
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
    </Grid>
    </Row>

    <BelladndTest dataURLs={dataURLs}></BelladndTest>
 
    </div>

    );
}

export default TestUI; 
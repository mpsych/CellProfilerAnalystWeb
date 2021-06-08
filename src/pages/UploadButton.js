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
import Tooltip from '@material-ui/core/Tooltip';


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    wrapper: {
    //  margin: theme.spacing(1),
      position: 'relative',
    },
    buttonSuccess: {
    //  backgroundColor: green[500],
      '&:hover': {
   //     backgroundColor: green[700],
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

function UploadButton(props){
    // const [uploading, setUploading] = React.useState(false)
    // const [success, setSuccess] = React.useState(false)
    
    const classes = useStyles();
    const buttonClassname = clsx({
      [classes.buttonSuccess]: props.success,
    });


    return(
    <div className={classes.root}>
							<div className={classes.wrapper}>
								<Tooltip title="Load Data" aria-label="load data">
									<Fab
                   					//size="medium"
										aria-label="save"
										color="primary"
										component="label"
										className={buttonClassname}
										// style={{ height: '5vw', width: '5vw' }}
										style={{ marginRight: 5 }}
									>
										{props.success ? (
											// <CheckIcon
											// // style={{ height: '50%', width: '50%'}}
											// />
											<CloudUploadIcon
											// style={{ height: '50%', width: '50%' }}
											/>
										) : (
											<CloudUploadIcon
											// style={{ height: '50%', width: '50%' }}
											/>
										)}
										<input
											type="file"
											hidden
											webkitdirectory="true"
											mozdirectory="true"
											msdirectory="true"
											odirectory="true"
											directory="true"
											multiple
											onChange={(eventObject) => {
												props.handleUpload(eventObject);
											}}
											disabled={!props.uploadButtonEnabled}
										/>
									</Fab>
								</Tooltip>
								{props.uploading && (
									<CircularProgress
										className={classes.fabProgress}
										size={68}
										// size={"6vw"}
										//  style={{   marginTop: "3%", marginRight: '20vw'}}
									/>
								)}
							</div>
						</div>
     
     );
}

export default UploadButton; 
import React from 'react';
import Fab from '@material-ui/core/Fab';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import { Row, Col, Container } from 'reactstrap';
import SaveIcon from '@material-ui/icons/Save';



function DownloadButton(props){
    const [open, setOpen] = React.useState(false);
    const [downloadClassifer, setDownloadClassifer] = React.useState(false);
    const [downloadTrainingSet, setDownloadTrainingSet] = React.useState(false);

    const handleDownloadClassifer = (event) => {
        setDownloadClassifer(true)
    }

    const handleDownloadTrainingSet = (event) => {
        setDownloadTrainingSet(true)
    }

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

   function download(){
       console.log(downloadClassifer)
       if (downloadClassifer == true){
        props.handleDownload()
       }
       return
   }


    return(
        <div>
        <Tooltip title="Download" aria-label="download">
							<Fab
							//	size="medium"
								aria-label="save"
								color="primary"
								component="label"
								disabled={!props.downloadButtonEnabled}
                                onClick={handleClickOpen}
								// style={{ height: '5vw', width: '5vw'}}
								style={{ positive: 'relative' }}
							>
								{' '}
								<SaveAltIcon
								// style={{ height: '50%', width: '50%' }}
								/>
							</Fab>
						</Tooltip>
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogContent>
                        <FormLabel component="legend">Download</FormLabel>
                        <FormControlLabel
                            control={
                            <Checkbox
                                onChange={handleDownloadClassifer}
                                color="primary"
                            />
                            }
                            label="Classifer"
                        />
                         <FormControlLabel
                                control={
                                <Checkbox
                                    onChange={handleDownloadTrainingSet}
                                    color="primary"
                                />
                                }
                                label="Training Set"
                            />
                         
                              <Button
                                size="small"
                                variant="contained"
                                style={{bottom:10}}
                                onClick={download}
                            >
                                Save
                            </Button>
                        
                            </DialogContent>
                        </Dialog>    
        </div>
    )
}

export default DownloadButton; 
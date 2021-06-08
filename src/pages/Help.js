import React from 'react';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function Help(){
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    return(
        <div>
        <Tooltip title="Help" aria-label="help">
								<IconButton
									color="primary"
                                    onClick={handleClickOpen}
                                    style={{height:65, width:65}}
								>
									<HelpOutlineIcon 
                                    size = "large"
                                   style={{height:50, width:50}}
                                    />
								</IconButton>
							</Tooltip>
         <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
         <AppBar>
        <Toolbar>
         <Typography variant="h6" color="inherit" >
              Info
            </Typography>
         <IconButton
           color="inherit" 
           onClick={handleClose} 
           aria-label="close" 
           style={{marginLeft: "93%", position:"fixed"}}

          >
            <CloseIcon />
            </IconButton>
            </Toolbar>
            </AppBar>

        <DialogTitle >
          Subscribe
        </DialogTitle>
        <DialogContent>
          <br></br>
          <h5>Getting Started </h5>
          <DialogContentText>
          Import your data files from Cell Profiler by clicking the load data button in the right corner. 
          Below is a link to download Cell Profiler, if you still need to prepare you data for import: 
          <br></br>
          <a href="https://cellprofiler.org/">https://cellprofiler.org/</a>
          <br></br>
          <br></br>
          If you are just looking to give CPA Web a try, download the example data below: 
          <br></br>
          ***downloadable data***
          <br></br>
          <br></br>
          You will know your data is uploaded when you see the green check in place of the load data button. 
          <hr></hr>
          </DialogContentText>
          
          <h5>Using CPA Web </h5>
          <DialogContentText>
          Once your data is uploaded, you can begin fetching cells to classify! 
          <br></br>
          <br></br>
          You have the option to fetch: random cells from your data set, positive cells (cells that possess the phenotype/ trait you are classifying for), 
          negative cells (cells that do not possess the phenotype/ trait you are classifying for), 
          cells from a specific image in your data set, cells from your positive or negative training set, 
          and cells that are confusing to classifier (the cells that the classifier is most unsure are positive or negative).
          <br></br>
          <br></br>
          It is a good idea to start by fetching random cells so the model can begin to learn based on your classifications. 
          <hr></hr>
          </DialogContentText>

          <h5>Classifying Cells </h5>
          <DialogContentText>
          Once you have fetched cells and they appear in the unclassified bin, you can begin dragging and dropping the cells into the positive 
          and negative bin based on the phenotype/trait you are classifying for.
          <br></br>
          <br></br>
          When you hover over cell images you learn their image and object numbers. 
          If you double click on a cell, the full image the cell belongs to will pop up and 
          show you where in the image the cell is coming from.
          <br></br>
          <br></br>
          When you feel happy with the cells in the positive and negative bin, you can press the train button to train the model. 
          While the model is training you will see loss and accuracy graphs informing you on the models progress.
          <br></br>
          <br></br>
          If there are cells you are unsure about or do not want to include in the training set, simply fetch again and the cells go away. 
          Also note that when you press train the cells in the unclassified bin will go away.
          <hr></hr>
          </DialogContentText>

          <h5>Exploring The Data </h5>
          <DialogContentText>
          To evaluate the state of the machine learning model you can press the evaluate button to see the confusion matrix. 
          <br></br>
          <br></br>
          To gain more  insight on the cell images, you can click on the score all button.
          This displays a histogram of the data distribution and a table containing information about all the cell images, their total, positive, negative, ratio, and adjusted ratio values. 
          You can sort the values in the table from biggest to smallest by hovering over the column label and selecting the direction of the arrow. 
          You can download the CSV of the score all table by pressing the save icon in the right corner of the score all window. 
          <hr></hr>
          </DialogContentText>

          <h5>Saving Your Work</h5>
          <DialogContentText>
          When you are satisfied with your model, simply click the download button in the
          top right corner of the main screen to download your classification model. 
          <hr></hr>
          </DialogContentText>

          <h5>Additional Questions</h5>
          <DialogContentText>
          If you have any additional questions on how to use Cell Profiler Analyst Web, 
          please post on the cell profiler analyst forum:
          <br></br>
          <a href="https://forum.image.sc/tag/cellprofiler-analyst">https://forum.image.sc/tag/cellprofiler-analyst</a>
          <br></br>
          <br></br>
          Happy Classifying!

          </DialogContentText>

        </DialogContent>
            
          
         
         </Dialog> 
        </div>
    )
}


export default Help; 
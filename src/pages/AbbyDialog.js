import React ,{useState, useRef} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';
import ConfusionMatrix from './AbDialogCanvas'
import { Conv2D } from '@tensorflow/tfjs-core';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

//this components is for pop-up dialog display the 'confusion_matrix_canvas' for Evaluation button
export default function DialogForCanvas() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    
  };

  const handleClose = () => {
    setOpen(false);
    
  };
  const confusion_matrix_canvas = useRef(null);

  return (
    <div  >

      {/* evaluate button -> open a dialog window */}
      <Button variant="contained" onClick={handleClickOpen}>Evaluate</Button>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}>

        {/* close icon to exit the dialog window */}
        <CloseIcon onClick = {handleClose} style={{position: 'absolute', right: '10px', top: '10px',}}></CloseIcon>  
        
        {/* a canvas with a id : "confusion_matrix_canvas" */}
        {/* <canvas ref = {confusion_matrix_canvas} width={400} height={400} >
          
        </canvas> */}
        
        {/* import the ConfusionMatrix as a component and use here */}
        <ConfusionMatrix></ConfusionMatrix>
        
      </Dialog>
      
       
    </div>
  );
}

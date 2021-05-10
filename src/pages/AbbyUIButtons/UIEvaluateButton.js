import React ,{useState, useRef} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';
import ConfusionMatrix from './Evaluate_Canvas'

//TODO: need to solve state-passing issue between patent to child

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
  

  return (
    <div  >

      {/* evaluate button -> open a dialog window */}
      <Button variant="contained" onClick={handleClickOpen}>Evaluate</Button>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}>

        <CloseIcon onClick = {handleClose} style={{position: 'absolute', right: '10px', top: '10px',}}></CloseIcon>  

        <ConfusionMatrix></ConfusionMatrix>
        
      </Dialog>
      
       
    </div>
  );
}

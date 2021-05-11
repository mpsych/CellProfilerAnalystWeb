import React, { useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';
import ScoreAllTable from './Score_Table';

//TODO: need place to hold two graphs

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

//this components is for pop-up dialog display the 'confusion_matrix_canvas' for Evaluation button
export default function DialogForCanvas(props) {
	const [open, setOpen] = useState(false);
	const handleClickOpen = (props) => {
		props.handleScoreAll();
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			{/* evaluate button -> open a dialog window */}
			<Button variant="contained" onClick={() => handleClickOpen(props)}>
				Score All
			</Button>
			<Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose} fullScreen>
				{/* TODO:Layout of the Dialog */}
				<CloseIcon
					onClick={handleClose}
					style={{ position: 'absolute', right: '10px', top: '10px' }}
				></CloseIcon>
				<ScoreAllTable></ScoreAllTable>
				{/* TODO:need places for three graphs here, may be can import as componets */}
			</Dialog>
		</div>
	);
}

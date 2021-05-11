import React, { useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import ScoreAllTable from './AbbyUIButtons/Score_Table';
import ScoreAllHistagram from './ScoreAllGraph'
import { Row} from 'reactstrap';

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
			<Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose} >
				{/* TODO:Layout of the Dialog */}
			 	<Row>
				<SaveIcon
				style={{ position: 'absolute', right: '40px', top: '10px' }}
				></SaveIcon>
				<CloseIcon
					onClick={handleClose}
					style={{ position: 'absolute', right: '10px', top: '10px' }}
				></CloseIcon>
				</Row>
				<ScoreAllTable ></ScoreAllTable>
				<ScoreAllHistagram ></ScoreAllHistagram>
				{/* TODO:need places for three graphs here, may be can import as componets */}
			</Dialog>
		</div>
	);
}

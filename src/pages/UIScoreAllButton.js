import React, { useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import ScoreAllHistagram from './ScoreAllGraph';
import { Row } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import { downloadFile } from '../downloadFile';
import ScoreAllTable from './ScoreAll_Table';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const downloadCSV = function (props) {
	downloadFile('enrichment', props.scoreTableCsvString, '.csv');
};

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
			<Button variant="contained" onClick={() => handleClickOpen(props)}>
				Score All
			</Button>

			<Dialog open={open} TransitionComponent={Transition} onClose={handleClose}>
				{!props.scoreTableIsUpToDate ? (
					<CircularProgress style={{ height: 40, width: 40, margin: 40 }} />
				) : (
					<div>
						<Row>
							<Tooltip title="Download CSV" aria-label="download">
								<IconButton
									onClick={() => downloadCSV(props)}
									style={{ marginLeft: 500, marginTop: 5 }}
								>
									<SaveIcon style={{ color: 'black' }} />
								</IconButton>
							</Tooltip>

							<IconButton onClick={handleClose} style={{ marginRight: 15, marginTop: 5 }}>
								<CloseIcon style={{ color: 'black' }} />
							</IconButton>
						</Row>
						{/* <h6 style={{ marginLeft: 30, bottom: 0 }}>
							Alpha: {props.alphas[1].toFixed(3)} Beta: {props.alphas[0].toFixed(3)}{' '}
						</h6> */}

						<ScoreAllHistagram
							style={{ top: 0 }}
							alphas={props.alphas}
							histogramData={props.histogramData}
						></ScoreAllHistagram>

						<ScoreAllTable
							handleOpenBigPicture={props.handleOpenBigPicture}
							scoreTable={props.scoreTable}
						></ScoreAllTable>
					</div>
				)}
			</Dialog>
		</div>
	);
}

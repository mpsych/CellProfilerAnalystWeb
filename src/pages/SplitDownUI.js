import React from 'react';
import { Row } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';

//import UploadButton from './UploadButton'

import jones from '../jones.jpg';

import { GridContextProvider, GridDropZone, GridItem, swap, move } from 'react-grid-dnd';

import '../dndstyles.css';

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

function TestUIMVP() {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [dataProvider, setDataProvider] = React.useState(null);

	// var classifierManager = null;
	// const [classifierManager, setClassifierManager] = React.useState(null)
	const [fileListObject, setFileListObject] = React.useState(null);
	const [tileState, setTileState] = React.useState(constructTileState([jones, jones, jones]));

	const [success, setSuccess] = React.useState(false);
	const [fetching, setFetching] = React.useState(false);

	const classes = useStyles();
	const buttonClassname = clsx({
		[classes.buttonSuccess]: success,
	});

	function constructTileState(dataURLs) {
		return {
			unclassified: dataURLs.map((dataURL, idx, info) => {
				return { id: idx, address: dataURL, info: 'cell info, biology stuff' };
			}),
			positive: [],
			negative: [],
		};
	}

	function onChange(sourceId, sourceIndex, targetIndex, targetId) {
		if (targetId) {
			const result = move(tileState[sourceId], tileState[targetId], sourceIndex, targetIndex);
			return setTileState({
				...tileState,
				[sourceId]: result[0],
				[targetId]: result[1],
			});
		}

		const result = swap(tileState[sourceId], sourceIndex, targetIndex);
		return setTileState({
			...tileState,
			[sourceId]: result,
		});
	}

	return (
		<GridContextProvider onChange={onChange}>
			<div style={{ overflowX: 'hidden', height: '100%', width: '100%' }}>
				<div>
					<label
						style={{
							textAlign: 'left',
							backgroundColor: 'white',
							paddingLeft: '10%',
							marginBottom: '0.5%',
							userSelect: 'none',
						}}
					>
						Unclassified{' '}
					</label>

					<div>
						<GridDropZone
							className="dropzone "
							id="unclassified"
							boxesPerRow={8}
							rowHeight={80}
							style={{
								height: '20vw',
								maxHeight: 200,
								minHeight: 150,
								marginBottom: 10,
								marginLeft: '10%',
								width: '80%',
							}}
						>
							{!fetching ? (
								tileState.unclassified.map((item) => (
									<GridItem
										className="hoverTest"
										style={{
											height: '9vw',
											width: '10vw',
											// minHeight: 80,
											// minWidth: 80,
											// maxHeight: 105,
											// maxWidth: 105,
											// padding: 10,
										}}
										key={item.id}
									>
										<div className="grid-item">
											<div
												className="grid-item-content"
												style={{
													height: 60,
													width: 60,
													backgroundImage: `url(${item.address})`,
												}}
											>
												<span className="hoverText">{item.info}</span>
											</div>
										</div>
									</GridItem>
								))
							) : (
								<CircularProgress
									style={{ height: '7%', width: '7%', marginTop: '8%', marginLeft: '45%' }}
								/>
							)}
						</GridDropZone>
					</div>

					<Row>
						<label
							style={{
								textAlign: 'left',
								backgroundColor: 'white',
								paddingLeft: '11%',
								userSelect: 'none',
								marginBottom: '0.5%',
								marginTop: 0,
							}}
						>
							Positive
						</label>

						<label
							style={{
								textAlign: 'left',
								backgroundColor: 'white',
								paddingRight: '8%',
								userSelect: 'none',
								margin: 'auto',
								marginBottom: '0.5%',
								marginTop: 0,
							}}
						>
							Negative
						</label>
					</Row>

					<Row>
						<GridDropZone
							className="dropzone positive"
							id="positive"
							boxesPerRow={4}
							rowHeight={80}
							style={{ height: '20vw', maxHeight: 200, minHeight: 150 }}
						>
							{tileState.positive.map((item) => (
								<GridItem
									className="hoverTest"
									style={{
										height: '10vw',
										width: '10vw',
										minHeight: 80,
										minWidth: 80,
										maxHeight: 105,
										maxWidth: 105,
										padding: 10,
									}}
									key={item.id}
								>
									<div className="grid-item">
										<div
											className="grid-item-content"
											style={{ backgroundImage: `url(${item.address})` }}
										>
											<span className="hoverText">{item.info}</span>
										</div>
									</div>
								</GridItem>
							))}
						</GridDropZone>

						<GridDropZone
							className="dropzone negative"
							id="negative"
							boxesPerRow={4}
							rowHeight={80}
							style={{ height: '20vw', maxHeight: 200, minHeight: 150 }}
						>
							{tileState.negative.map((item) => (
								<GridItem
									className="hoverTest"
									style={{
										height: '10vw',
										width: '10vw',
										minHeight: 80,
										minWidth: 80,
										maxHeight: 105,
										maxWidth: 105,
										padding: 10,
									}}
									key={item.address}
								>
									<div className="grid-item">
										<div
											className="grid-item-content"
											style={{ backgroundImage: `url(${item.address})` }}
										>
											<span className="hoverText">{item.info}</span>
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

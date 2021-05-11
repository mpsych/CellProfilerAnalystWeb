import React from 'react';
import { Row, Col, Container } from 'reactstrap';
import { Box, Button, Grid, IconButton, Menu, MenuItem, Card, TextField } from '@material-ui/core';
import logo from '../cpa_logo(blue).svg';
import { Image, Dropdown, DropdownButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';
//import UploadButton from './UploadButton'

import Evaluate from './AbbyUIButtons/UIEvaluateButton';
import ScoreAll from './AbbyUIButtons/UIScoreAllButton';
import { v4 as uuidv4 } from 'uuid';

import jones from '../jones.jpg';

import { GridContextProvider, GridDropZone, GridItem, swap, move } from 'react-grid-dnd';

import '../dndstyles.css';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import UploadButton from './UploadButton';

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
	const [tileState, setTileState] = React.useState(constructTileState([]));

	const [fetchButtonEnabled, setFetchButtonEnabled] = React.useState(false);
	const [trainButtonEnabled, setTrainButtonEnabled] = React.useState(false);
	const [evaluateButtonEnabled, setEvaluateButtonEnabled] = React.useState(false);
	const [downloadButtonEnabled, setDownloadButtonEnabled] = React.useState(false);
	const [uploadButtonEnabled, setUploadButtonEnabled] = React.useState(true);
	const [scoreAllButtonEnabled, setscoreAllButtonEnabled] = React.useState(false);
	const [uploading, setUploading] = React.useState(false);
	const [success, setSuccess] = React.useState(false);
	const [fetching, setFetching] = React.useState(false);
	const [openFetchDropdown, setOpenFetchDropdown] = React.useState(false);
	const [openTrainDropdown, setOpenTrainDropdown] = React.useState(false);

	const [canvasWebWorker, setCanvasWebWorker] = React.useState(null);
	const [dataWebWorker, setDataWebWorker] = React.useState(null);
	const [classifierWebWorker, setClassifierWebWorker] = React.useState(null);
	const [confusionMatrix, setConfusionMatrix] = React.useState([
		[0, 0],
		[0, 0],
	]);
	const [trainingObject, setTrainingObject] = React.useState(null);
	const [activeCellPairs, setActiveCellPairs] = React.useState([]);
	const [trainingCellPairs, setTrainingCellPairs] = React.useState([]);

	const [scoreTableIsUpToDate, setScoreTableIsUpToDate] = React.useState(false);
	const [scoreTableObject, setScoreTableObject] = React.useState(null);

	const trainingLossCanvasParentRef = React.useRef();
	const trainingAccuracyCanvasParentRef = React.useRef();

	const [selectedFetchImageNumber, setSelectedFetchImageNumber] = React.useState(0);
	const [fetchImageNumberButtonEnabled, setFetchImageNumberButtonEnabled] = React.useState(false);
	const DEBUG = true;
	var __ = null;

	React.useEffect(() => {
		const dataToCanvasWorkerChannel = new MessageChannel();
		const dataToClassifierWorkerChannel = new MessageChannel();

		const dataWebWorker = constructWebWorker('../dataWorker.js', 'dataWebWorker');
		dataWebWorker.postMessage({ action: 'connectToCanvasWorker' }, [dataToCanvasWorkerChannel.port1]);
		dataWebWorker.postMessage({ action: 'connectToClassifierWorker' }, [dataToClassifierWorkerChannel.port1]);
		setDataWebWorker(dataWebWorker);

		const canvasWebWorker = constructWebWorker('../canvasWorker.js', 'CanvasWebWorker');
		canvasWebWorker.postMessage({ action: 'connectToDataWorker' }, [dataToCanvasWorkerChannel.port2]);
		setCanvasWebWorker(canvasWebWorker);

		const classifierWebWorker = constructWebWorker('../classifierWorker.js', 'classifierWebWorker');
		classifierWebWorker.postMessage({ action: 'connectToDataWorker' }, [dataToClassifierWorkerChannel.port2]);
		setClassifierWebWorker(classifierWebWorker);
	}, []);

	const constructWebWorker = function (sourcePath, name) {
		const worker = new Worker(sourcePath);
		worker.addEventListener('error', (event) => {
			console.log(`[${name}] Error`, event.message, event);
		});
		return worker;
	};

	const classes = useStyles();
	const buttonClassname = clsx({
		[classes.buttonSuccess]: success,
	});

	const N = 20;

	const handleClickFetchDropDown = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseFetchDropDown = (fetchType) => {
		setAnchorEl(null);
		if (fetchType !== undefined && fetchType !== null) {
			handleFetch(fetchType);
		}
	};

	const disableIterationButtons = () => {
		setFetchButtonEnabled(false);
		setTrainButtonEnabled(false);
		setDownloadButtonEnabled(false);
		//   setEvaluateButtonEnabled(false)
	};
	const enableIterationButtons = () => {
		setFetchButtonEnabled(true);
		setTrainButtonEnabled(true);
		setDownloadButtonEnabled(true);
		setEvaluateButtonEnabled(true);
	};

	const handleFetch = async (fetchType) => {
		console.log('Fetch!');
		if ((fetchType === undefined) | (fetchType == null)) {
			return;
		}
		setFetching(true);
		const emptyTileState = { unclassified: [], positive: [], negative: [] };
		setTileState(emptyTileState);
		switch (fetchType) {
			case 'Random':
				workerActionPromise(dataWebWorker, 'get', { getType: 'cellPairs', getArgs: { amount: 16 } })
					.then((event) => {
						const cellPairs = event.data.getResult;
						setActiveCellPairs(cellPairs);
						return workerActionPromise(canvasWebWorker, 'get', {
							getType: 'blobUrlsFromCellPairs',
							getArgs: { cellPairs },
						});
					})
					.then((event) => {
						const newTileState = constructTileState(event.data.blobUrls);
						setTileState(newTileState);
						setFetching(false);
					});
				break;
			case 'Positive':
			case 'Negative':
				workerActionPromise(dataWebWorker, 'get', { getType: 'cellPairs', getArgs: { amount: 100 } })
					.then((event) => {
						const cellPairs = event.data.getResult;

						return workerActionPromise(classifierWebWorker, 'predictFilterCellPairs', {
							cellPairs,
							classType: fetchType,
						});
					})
					.then((event) => {
						const { filteredCellPairs } = event.data;
						const slicedCellPairs = filteredCellPairs.slice(0, 16);
						setActiveCellPairs(filteredCellPairs);
						return workerActionPromise(canvasWebWorker, 'get', {
							getType: 'blobUrlsFromCellPairs',
							getArgs: { cellPairs: slicedCellPairs },
						});
					})
					.then((event) => {
						const newTileState = constructTileState(event.data.blobUrls);
						setTileState(newTileState);
						setFetching(false);
					});
				break;
			case 'Confusing': {
				workerActionPromise(dataWebWorker, 'get', { getType: 'cellPairs', getArgs: { amount: 100 } })
					.then((event) => {
						const cellPairs = event.data.getResult;

						return workerActionPromise(classifierWebWorker, 'confusingFilterCellPairs', {
							cellPairs: cellPairs,
						});
					})
					.then((event) => {
						const { sortedCellPairs } = event.data;
						const slicedSortedCellPairs = sortedCellPairs.slice(0, 16);
						setActiveCellPairs(slicedSortedCellPairs);
						return workerActionPromise(canvasWebWorker, 'get', {
							getType: 'blobUrlsFromCellPairs',
							getArgs: { cellPairs: slicedSortedCellPairs },
						});
					})
					.then((event) => {
						const newTileState = constructTileState(event.data.blobUrls);
						setTileState(newTileState);
						setFetching(false);
					});
				break;
			}
			case 'ImageNumber':
				console.log('fetch by image number: ' + selectedFetchImageNumber);
				workerActionPromise(dataWebWorker, 'get', {
					getType: 'cellPairsFromImage',
					getArgs: { ImageNumber: selectedFetchImageNumber },
				})
					.then((event) => {
						const cellPairs = event.data.getResult;
						console.log(cellPairs);
						return workerActionPromise(classifierWebWorker, 'predictFilterCellPairs', {
							cellPairs,
							classType: fetchType,
						});
					})
					.then((event) => {
						const { filteredCellPairs } = event.data;
						const slicedCellPairs = filteredCellPairs.slice(0, 16);
						setActiveCellPairs(filteredCellPairs);
						return workerActionPromise(canvasWebWorker, 'get', {
							getType: 'blobUrlsFromCellPairs',
							getArgs: { cellPairs: slicedCellPairs },
						});
					})
					.then((event) => {
						const newTileState = constructTileState(event.data.blobUrls);
						setTileState(newTileState);
						setFetching(false);
					});
				break;

			case 'TrainingPositive':
			case 'TrainingNegative': {
				__ = DEBUG ? console.log(`Enter fetch: ${fetchType}`) : null;
				const cellPairs = trainingObject.trainingData.map((dataRow) => ({
					ImageNumber: dataRow[0],
					ObjectNumber: dataRow[1],
				}));
				__ = DEBUG ? console.log(cellPairs) : null;
				workerActionPromise(classifierWebWorker, 'predictFilterCellPairs', {
					cellPairs,
					classType: fetchType === 'TrainingPositive' ? 'Positive' : 'Negative',
				})
					.then((event) => {
						__ = DEBUG ? console.log(`Return from predictFilterCellPairs `, event.data) : null;
						const { filteredCellPairs } = event.data;
						setActiveCellPairs(filteredCellPairs);
						return workerActionPromise(canvasWebWorker, 'get', {
							getType: 'blobUrlsFromCellPairs',
							getArgs: { cellPairs: filteredCellPairs },
						});
					})
					.then((event) => {
						__ = DEBUG ? console.log(`Return get blobUrlsFromCellPairs`, event.data) : null;
						const newTileState = constructTileState(event.data.blobUrls);
						setTileState(newTileState);
						setFetching(false);
					});
				break;
			}
		}
	};

	const handleTrain = async () => {
		console.log('Train!');
		const positiveCellPairs = tileState.positive.map((element) => activeCellPairs[element.id]);
		const negativeCellPairs = tileState.negative.map((element) => activeCellPairs[element.id]);

		const totalCellPairs = positiveCellPairs.concat(negativeCellPairs);
		const newLabels = new Array(positiveCellPairs.length)
			.fill(1)
			.concat(new Array(negativeCellPairs.length).fill(0));

		setScoreTableIsUpToDate(false);
		setTileState(constructTileState([]));
		setActiveCellPairs([]);

		workerActionPromise(dataWebWorker, 'get', {
			getType: 'objectRowsFromCellpairs',
			getArgs: { cellPairs: totalCellPairs },
		}).then((event) => {
			const dataRows = event.data.getResult;

			const newTrainingObject = {
				classifierType: 'LogisticRegression',
				trainingData: [...trainingObject.trainingData, ...dataRows],
				trainingLabels: [...trainingObject.trainingLabels, ...newLabels],
				featureIndicesToUse: trainingObject.featureIndicesToUse,
			};
			return trainSequencePromise(newTrainingObject);
		});
	};

	const trainSequencePromise = function (currentTrainingObject) {
		setOpenTrainDropdown(true);
		var UUID = null;
		let updateCanvasesListener = (event) => {
			if (UUID == event.data.uuid) {
				switch (event.data.action) {
					case 'updateTrainingCanvases':
						tfvis.show.history(trainingLossCanvasParentRef.current, event.data.trainLogs, [
							...event.data.ticks.loss,
							...event.data.ticks.accuracy,
						]);
						// tfvis.show.history(
						// 	trainingAccuracyCanvasParentRef.current,
						// 	event.data.trainLogs,

						// );
						break;
					default:
						console.log("didn't render bad action");
				}
			}
		};

		workerActionPromise(classifierWebWorker, 'startTrainingGraphsConnection', {})
			.then((event) => {
				UUID = event.data.uuid;
				classifierWebWorker.addEventListener('message', updateCanvasesListener);
				return workerActionPromise(classifierWebWorker, 'train', { trainingObject: currentTrainingObject });
			})
			.then(() => {
				workerActionPromise(classifierWebWorker, 'endTrainingGraphsConnection', {});
				classifierWebWorker.removeEventListener('message', updateCanvasesListener);
				return workerActionPromise(classifierWebWorker, 'confusionMatrix');
			})
			.then((event) => {
				const newConfusionMatrix = event.data.confusionMatrix;
				setConfusionMatrix(newConfusionMatrix);
			})
			.then(() => {
				setTrainingObject(currentTrainingObject);
				setOpenTrainDropdown(false);
			});
	};

	const workerActionPromise = function (worker, action, data) {
		const UUID = uuidv4();

		return new Promise((resolve) => {
			let selfDestructingEventHandler = (event) => {
				if (event.data.uuid === UUID) {
					worker.removeEventListener('message', selfDestructingEventHandler);
					resolve(event);
				}
			};
			worker.addEventListener('message', selfDestructingEventHandler);

			worker.postMessage({ action, ...data, uuid: UUID });
		});
	};

	const handleUpload = async (eventObject) => {
		console.log('Upload!');
		setUploading(true);
		workerActionPromise(dataWebWorker, 'init', { fileListObject: eventObject.target.files })
			.then(() => {
				console.log('done');
				workerActionPromise(dataWebWorker, 'get', {
					getType: 'cellPairData',
					getArgs: { cellPair: { ImageNumber: 1, ObjectNumber: 1 } },
				});
			})
			.then(() => {
				console.log('next');
				return workerActionPromise(dataWebWorker, 'get', { getType: 'trainingObject' });
			})
			.then((event) => {
				const initialTrainingObject = event.data.getResult;
				return trainSequencePromise(initialTrainingObject);
			})
			.then(() => {
				setUploading(false);
				setSuccess(true);
				enableIterationButtons();
				setUploadButtonEnabled(false);
			});
	};

	const handleScoreAll = async () => {
		console.log('Score All!');
		if (!scoreTableIsUpToDate) {
			console.log('Score All!');
			return workerActionPromise(classifierWebWorker, 'scoreObjectData').then((event) => {
				const newScoreTableObject = event.data.scoreTableObject;
				console.log(newScoreTableObject);
				const scoreDataRows = Object.keys(newScoreTableObject.imageToCountsMap).map((key) => ({
					imageNumber: key,
					total: newScoreTableObject.imageToCountsMap[key][0] + newScoreTableObject.imageToCountsMap[key][1],
					positive: newScoreTableObject.imageToCountsMap[key][1],
					negative: newScoreTableObject.imageToCountsMap[key][0],
					ratio: newScoreTableObject.ratios[key],
					adjustratio: newScoreTableObject.adjustedRatios[key],
				}));
				console.log(scoreDataRows);
				setScoreTableObject(newScoreTableObject);
				setScoreTableIsUpToDate(true);
			});
		}
	};

	const handleDownload = async () => {
		console.log('Download!');
		return workerActionPromise(classifierWebWorker, 'getClassifier').then((event) => {
			tf.loadLayersModel(`indexeddb://${trainingObject.classifierType}`).then((model) => {
				model.save(`downloads://${trainingObject.classifierType}`);
			});

			// const classifier = event.data.classifier;
			// classifier.save(`downloads://${trainingObject.classifierType}`);
		});
	};

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

	const handleClickOpenImNumFetchDropdown = () => {
		setAnchorEl(null);
		setOpenFetchDropdown(true);
	};

	const handleClickCloseImNumFetchDropdown = () => {
		setOpenFetchDropdown(false);
		handleCloseFetchDropDown('ImageNumber');
	};

	return (
		<GridContextProvider onChange={onChange}>
			<div style={{ overflowX: 'hidden', height: '100%', width: '100%' }}>
				<Row style={{}}>
					<Image
						src={logo}
						style={{
							marginLeft: '11%',
							height: '30%',
							width: '25%',
							position: 'relative',
							maxHeight: '125px',
							marginBottom: '2%',
							marginTop: '2%',
						}}
					></Image>

					<Col style={{ left: '40%' }}>
						<div className={classes.root}>
							<div className={classes.wrapper}>
								<Tooltip title="Load Data" aria-label="load data">
									<Fab
										aria-label="save"
										color="primary"
										component="label"
										className={buttonClassname}
										style={{ height: '5vw', width: '5vw' }}
									>
										{success ? (
											<CheckIcon style={{ height: '50%', width: '50%' }} />
										) : (
											<CloudUploadIcon style={{ height: '50%', width: '50%' }} />
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
												handleUpload(eventObject);
											}}
											disabled={!uploadButtonEnabled}
										/>
									</Fab>
								</Tooltip>
								{/* size={68}  */}
								{uploading && (
									<CircularProgress
										className={classes.fabProgress}
										style={{ height: '6vw', width: '6vw', marginTop: '4%', marginRight: '4%' }}
									/>
								)}
							</div>
						</div>
					</Col>
					<Col style={{ left: '15%', marginTop: '1%' }}>
						<Tooltip title="Download" aria-label="download">
							<Fab
								aria-label="save"
								color="primary"
								component="label"
								disabled={!downloadButtonEnabled}
								onClick={handleDownload}
								style={{ height: '5vw', width: '5vw' }}
							>
								{' '}
								<SaveAltIcon style={{ height: '50%', width: '50%' }} />
							</Fab>
						</Tooltip>
					</Col>
				</Row>
				<Row>
					<Grid container justify="center" spacing={2} style={{ marginBottom: 15 }}>
						<Grid key={0} item>
							<Button
								disabled={!fetchButtonEnabled}
								variant="contained"
								aria-controls="simple-menu"
								aria-haspopup="true"
								onClick={handleClickFetchDropDown}
							>
								Fetch
							</Button>
							<Menu
								id="simple-menu"
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={() => handleCloseFetchDropDown(null)}
							>
								<MenuItem onClick={() => handleCloseFetchDropDown('Random')}>Random</MenuItem>
								<MenuItem onClick={() => handleCloseFetchDropDown('Positive')}>Positive</MenuItem>
								<MenuItem onClick={() => handleCloseFetchDropDown('Negative')}>Negative</MenuItem>
								<MenuItem onClick={handleClickOpenImNumFetchDropdown}>By Image</MenuItem>
								<MenuItem onClick={() => handleCloseFetchDropDown('TrainingPositive')}>
									Training Set Positive
								</MenuItem>
								<MenuItem onClick={() => handleCloseFetchDropDown('TrainingNegative')}>
									Training Set Negative
								</MenuItem>
								<MenuItem onClick={() => handleCloseFetchDropDown('Confusing')}>Confusing</MenuItem>

								<Dialog open={openFetchDropdown} onClose={() => handleCloseFetchDropDown(null)}>
									<DialogTitle>Fetch By Image</DialogTitle>
									<DialogContent>
										<DialogContentText>
											Select the image number you would like to fetch from.
										</DialogContentText>
										<form noValidate>
											<FormControl>
												<TextField
													onChange={(event) => {
														if (
															event.target.value === null ||
															event.target.value === undefined ||
															event.target.value === ''
														) {
															return;
														}
														setSelectedFetchImageNumber(event.target.value);
														setFetchImageNumberButtonEnabled(true);
													}}
													type="number"
													label="Image Number"
												></TextField>
											</FormControl>
										</form>
									</DialogContent>
									<DialogActions>
										<Button
											disabled={!fetchImageNumberButtonEnabled}
											onClick={handleClickCloseImNumFetchDropdown}
											color="primary"
										>
											Ok
										</Button>
									</DialogActions>
								</Dialog>
							</Menu>
						</Grid>

						<Grid key={1} item>
							{/* style = {{height: "5vw", width:"10vw", minHeight:2, maxHeight: 35, maxwidth: 50, fontSize: "max(1.5vw, 20)"}}  */}
							<Button disabled={!trainButtonEnabled} variant="contained" onClick={handleTrain}>
								Train
							</Button>
							<Dialog fullWidth={500} open={openTrainDropdown}>
								<DialogTitle>Loss and Accuracy</DialogTitle>
								<DialogContent>
									{/* <img width={100} height={100} src={jones}></img> */}
									<div width={300} ref={trainingAccuracyCanvasParentRef}></div>
									<div width={300} ref={trainingLossCanvasParentRef}></div>
								</DialogContent>
							</Dialog>
						</Grid>

						<Grid key={2} item>
							{/* <Button disabled={!evaluateButtonEnabled} variant="contained" onClick={()=>{}}>Evaluate</Button>  */}
							{/* TODO: need to fix button disabled DONE*/}
							{!evaluateButtonEnabled ? (
								<Button disabled={!evaluateButtonEnabled} variant="contained" onClick={() => {}}>
									Evaluate
								</Button>
							) : (
								<Evaluate confusionMatrix={confusionMatrix}></Evaluate>
							)}
						</Grid>

						<Grid key={3} item>
							{/* <Button  disabled={!scoreAllButtonEnabled} variant="contained" onClick={()=>{}}>Score All</Button> */}
							{/* TODO: need to fix button disabled DONE*/}

							{!evaluateButtonEnabled ? (
								<Button disabled={!evaluateButtonEnabled} variant="contained" onClick={handleScoreAll}>
									Score All
								</Button>
							) : (
								<ScoreAll handleScoreAll={handleScoreAll}></ScoreAll>
							)}
						</Grid>
					</Grid>
				</Row>

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
											height: '15vw',
											width: '15vw',
											minHeight: 80,
											minWidth: 80,
											maxHeight: 120,
											maxWidth: 120,
											padding: 10,
										}}
										key={item.id}
									>
										<div className="grid-item">
											<div
												className="grid-item-content"
												style={{
													backgroundImage: `url(${item.address})`,
													height: '5vw',
													width: '5vw',
												}}
											>
												<span className="hoverText">{item.info}</span>
											</div>
										</div>
									</GridItem>
								))
							) : (
								<CircularProgress
									style={{ height: '6vw', width: '6vw', marginTop: '6%', marginLeft: '45%' }}
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
							rowHeight={0}
							style={{ height: '20vw', maxHeight: 200, minHeight: 150 }}
						>
							{tileState.positive.map((item) => (
								<GridItem
									className="hoverTest"
									style={{
										height: '15vw',
										width: '15vw',
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
											style={{
												backgroundImage: `url(${item.address})`,
												height: '5vw',
												width: '5vw',
											}}
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
										height: '15vw',
										width: '15vw',
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
											style={{
												backgroundImage: `url(${item.address})`,
												height: '5vw',
												width: '5vw',
											}}
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

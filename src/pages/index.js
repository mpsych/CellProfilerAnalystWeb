import React from "react";
import { Row, Col, Container } from "reactstrap";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Card,
  TextField,
  Typography,
} from "@material-ui/core";
import logo from "../cpa_logo(blue).png";
import { Image, Dropdown, DropdownButton } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import Fab from "@material-ui/core/Fab";
import CheckIcon from "@material-ui/icons/Check";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";

import Evaluate from "./AbbyUIButtons/UIEvaluateButton";
import ScoreAll from "./UIScoreAllButton";
import { v4 as uuidv4 } from "uuid";
import Help from "./Help";

import jones from "../jones.jpg";

import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  swap,
  move,
} from "react-grid-dnd";

import "../dndstyles.css";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import { downloadFile } from "../downloadFile";
import UploadButton from "./UploadButton";
import DownloadButton from "./DownloadButton";

import CompatibilityCheck from "./components/compatibilityCheckDialog";

function TestUIMVP() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dataProvider, setDataProvider] = React.useState(null);

  // var classifierManager = null;
  // const [classifierManager, setClassifierManager] = React.useState(null)
  const [fileListObject, setFileListObject] = React.useState(null);
  const [tileState, setTileState] = React.useState({
    unclassified: [],
    positive: [],
    negative: [],
  });

  const [fetchButtonEnabled, setFetchButtonEnabled] = React.useState(false);
  const [trainButtonEnabled, setTrainButtonEnabled] = React.useState(false);
  const [evaluateButtonEnabled, setEvaluateButtonEnabled] = React.useState(
    false
  );
  const [downloadButtonEnabled, setDownloadButtonEnabled] = React.useState(
    false
  );
  const [uploadButtonEnabled, setUploadButtonEnabled] = React.useState(true);
  const [scoreAllButtonEnabled, setscoreAllButtonEnabled] = React.useState(
    false
  );
  const [uploading, setUploading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [fetching, setFetching] = React.useState(false);
  const [
    initialFetchingPositiveNegative,
    setInitialFetchingPositiveNegative,
  ] = React.useState(false);
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
  const [trainingCellPairs, setTrainingCellPairs] = React.useState([]);

  const [scoreTableIsUpToDate, setScoreTableIsUpToDate] = React.useState(false);
  const [scoreTableObject, setScoreTableObject] = React.useState(null);
  const [scoreTable, setScoreTable] = React.useState([]);
  const [scoreAlphas, setScoreAlphas] = React.useState();
  const [histogramData, setHistogramData] = React.useState([]);
  const [alpha, setAlpha] = React.useState(null);
  const [beta, setBeta] = React.useState(null);

  const trainingLossCanvasParentRef = React.useRef();
  const trainingAccuracyCanvasParentRef = React.useRef();

  const [
    selectedFetchImageNumber,
    setSelectedFetchImageNumber,
  ] = React.useState(1);
  const [
    fetchImageNumberButtonEnabled,
    setFetchImageNumberButtonEnabled,
  ] = React.useState(false);
  const DEBUG = true;

  const [
    cellBigPictureDialogOpen,
    setCellBigPictureDialogOpen,
  ] = React.useState(false);
  const [bigPictureSource, setBigPictureSource] = React.useState(jones);
  const [bigPictureTitle, setBigPictureTitle] = React.useState("");
  const [currentlyScoring, setCurrentlyScoring] = React.useState(false);
  const [scoreTableCsvString, setScoreTableCsvString] = React.useState("");
  var __ = null;

  React.useEffect(() => {
    window.addEventListener("beforeunload", function (e) {
      e.preventDefault();
      e.returnValue = "Sure?";
      return "Sure?";
    });
  }, []);

  React.useEffect(() => {
    const dataToCanvasWorkerChannel = new MessageChannel();
    const dataToClassifierWorkerChannel = new MessageChannel();
    const canvasToClassifierWorkerChannel = new MessageChannel();
    const dataWebWorker = constructWebWorker("dataWorker.js", "dataWebWorker");

    dataWebWorker.postMessage({ action: "connectToClassifierWorker" }, [
      dataToClassifierWorkerChannel.port1,
    ]);
    dataWebWorker.postMessage({ action: "connectToCanvasWorker" }, [
      dataToCanvasWorkerChannel.port1,
    ]);
    setDataWebWorker(dataWebWorker);

    const classifierWebWorker = constructWebWorker(
      "classifierWorker.js",
      "classifierWebWorker"
    );
    classifierWebWorker.postMessage({ action: "connectToDataWorker" }, [
      dataToClassifierWorkerChannel.port2,
    ]);
    classifierWebWorker.postMessage({ action: "connectToCanvasWorker" }, [
      canvasToClassifierWorkerChannel.port1,
    ]);
    setClassifierWebWorker(classifierWebWorker);

    const canvasWebWorker = constructWebWorker(
      "canvasWorker.js",
      "CanvasWebWorker"
    );
    canvasWebWorker.postMessage({ action: "connectToDataWorker" }, [
      dataToCanvasWorkerChannel.port2,
    ]);
    canvasWebWorker.postMessage({ action: "connectToClassifierWorker" }, [
      canvasToClassifierWorkerChannel.port2,
    ]);
    setCanvasWebWorker(canvasWebWorker);
  }, []);

  const constructWebWorker = function (sourcePath, name) {
    const worker = new Worker(sourcePath);
    worker.addEventListener("error", (event) => {
      console.log(`[${name}] Error`, event.message, event);
    });
    return worker;
  };

  const N = 20;
  const MAX_ITERATION_COUNT = 1000;

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

  const handleOpenCellBigPicture = async function (cellPair) {
    // console.log('open big picture');
    // console.log(cellPair);
    setCellBigPictureDialogOpen(true);
    setBigPictureTitle(
      `Image: ${cellPair.ImageNumber}, Object: ${cellPair.ObjectNumber}`
    );
    return workerActionPromise(canvasWebWorker, "get", {
      getType: "blobUrlBigPictureFromCellPair",
      getArgs: { cellPair },
    }).then((event) => {
      const blobUrl = event.data.getResult;
      setBigPictureSource(blobUrl);
    });
  };
  const handleOpenBigPicture = async function (imageNumber) {
    if (!imageNumber) {
      return;
    }
    // console.log('open big picture');
    // console.log(imageNumber);
    setCellBigPictureDialogOpen(true);
    setBigPictureTitle(`Image: ${imageNumber}`);
    return workerActionPromise(canvasWebWorker, "get", {
      getType: "blobUrlBigPictureByImageNumber",
      getArgs: { imageNumber },
    }).then((event) => {
      const blobUrl = event.data.getResult;
      setBigPictureSource(blobUrl);
    });
  };
  const handleCloseCellBigPicture = function () {
    // console.log('close big picture');
    setCellBigPictureDialogOpen(false);
  };

  const handleFetch = async (fetchType) => {
    // console.log('Fetch!');
    if ((fetchType === undefined) | (fetchType == null)) {
      return;
    }
    setFetching(true);
    const clearedUnclassifiedTileState = { ...tileState, unclassified: [] };
    setTileState(clearedUnclassifiedTileState);
    switch (fetchType) {
      case "Random": {
        let event = await workerActionPromise(dataWebWorker, "get", {
          getType: "cellPairs",
          getArgs: { amount: 16 },
        });

        const { getResult: cellPairs } = event.data;

        event = await workerActionPromise(canvasWebWorker, "get", {
          getType: "blobUrlsFromCellPairs",
          getArgs: { cellPairs },
        });
        const blobUrls = event.data.getResult;
        const newTileState = await replaceUnclassifiedTileStatePromise(
          tileState,
          blobUrls,
          cellPairs
        );
        // console.log(newTileState);
        setTileState(newTileState);
        setFetching(false);
        break;
      }
      case "Positive":
      case "Negative": {
        let accumCellPairs = [];
        let iterationCount = 0;
        let totalIterationCount = 0;

        while (accumCellPairs.length < 16) {
          let event = await workerActionPromise(dataWebWorker, "get", {
            getType: "cellPairs",
            getArgs: { amount: 100 },
          });
          const { getResult: cellPairs } = event.data;
          event = await workerActionPromise(
            classifierWebWorker,
            "predictFilterCellPairs",
            {
              cellPairs,
              classType: fetchType,
            }
          );
          const { filteredCellPairs } = event.data;

          // get rid of duplicates
          for (let i = 0; i < filteredCellPairs.length; i++) {
            const sampledCellPair = filteredCellPairs[i];
            let notYetSampled = true;
            for (let j = 0; j < accumCellPairs.length; j++) {
              if (
                sampledCellPair.ImageNumber === accumCellPairs[j].ImageNumber &&
                sampledCellPair.ObjectNumber === accumCellPairs[j].ObjectNumber
              ) {
                notYetSampled = false;
                break;
              }
            }

            if (notYetSampled) {
              accumCellPairs.push(sampledCellPair);
            }
          }
          // console.log(accumCellPairs);
          // accumCellPairs = accumCellPairs.concat(filteredCellPairs);

          totalIterationCount++;
          if (iterationCount++ >= MAX_ITERATION_COUNT) {
            if (
              window.confirm(
                `CPAW Has Found ${
                  accumCellPairs.length
                } Unique ${fetchType} Cells After Testing ${
                  100 * totalIterationCount
                } Cells With Replacement, Would You Like To Continue?`
              )
            ) {
              iterationCount = 0;
              continue;
            } else {
              break;
            }
          }
        }
        // console.log(`Fetched ${fetchType} Cells in ${totalIterationCount} iterations`);

        const slicedCellPairs = accumCellPairs.slice(0, 16);
        let event = await workerActionPromise(canvasWebWorker, "get", {
          getType: "blobUrlsFromCellPairs",
          getArgs: { cellPairs: slicedCellPairs },
        });
        const blobUrls = event.data.getResult;
        const newTileState = await replaceUnclassifiedTileStatePromise(
          tileState,
          blobUrls,
          slicedCellPairs
        );
        setTileState(newTileState);
        setFetching(false);
        break;
      }
      case "Confusing": {
        let event = await workerActionPromise(dataWebWorker, "get", {
          getType: "cellPairs",
          getArgs: { amount: 1000 },
        });
        const { getResult: cellPairs } = event.data;

        event = await workerActionPromise(
          classifierWebWorker,
          "confusingSortCellPairs",
          {
            cellPairs: cellPairs,
          }
        );
        const { sortedCellPairs } = event.data;
        const slicedSortedCellPairs = sortedCellPairs.slice(0, 16);
        event = await workerActionPromise(canvasWebWorker, "get", {
          getType: "blobUrlsFromCellPairs",
          getArgs: { cellPairs: slicedSortedCellPairs },
        });
        const blobUrls = event.data.getResult;
        const newTileState = await replaceUnclassifiedTileStatePromise(
          tileState,
          blobUrls,
          slicedSortedCellPairs
        );

        setTileState(newTileState);
        setFetching(false);
        break;
      }
      case "MorePositive":
      case "MoreNegative": {
        // console.log(fetchType);

        const classType =
          fetchType === "MorePositive" ? "Positive" : "Negative";

        let accumCellPairs = [];
        let iterationCount = 0;
        let totalIterationCount = 0;

        while (accumCellPairs.length < 16) {
          let event = await workerActionPromise(dataWebWorker, "get", {
            getType: "cellPairs",
            getArgs: { amount: 1000 },
          });
          const { getResult: cellPairs } = event.data;
          event = await workerActionPromise(
            classifierWebWorker,
            "moreClassSortCellPairs",
            {
              cellPairs,
              classType,
            }
          );
          const { sortedCellPairs } = event.data;

          // get rid of duplicates
          for (let i = 0; i < sortedCellPairs.length; i++) {
            const sampledCellPair = sortedCellPairs[i];
            let notYetSampled = true;
            for (let j = 0; j < accumCellPairs.length; j++) {
              if (
                sampledCellPair.ImageNumber === accumCellPairs[j].ImageNumber &&
                sampledCellPair.ObjectNumber === accumCellPairs[j].ObjectNumber
              ) {
                notYetSampled = false;
                break;
              }
            }

            if (notYetSampled) {
              accumCellPairs.push(sampledCellPair);
            }
          }

          totalIterationCount++;
          if (iterationCount++ >= MAX_ITERATION_COUNT) {
            if (
              window.confirm(
                `CPAW Has Found ${
                  accumCellPairs.length
                } Unique ${fetchType} Cells After Testing ${
                  100 * totalIterationCount
                } Cells With Replacement, Would You Like To Continue?`
              )
            ) {
              iterationCount = 0;
              continue;
            } else {
              break;
            }
          }
        }

        const slicedSortedCellPairs = accumCellPairs.slice(0, 16);
        let event = await workerActionPromise(canvasWebWorker, "get", {
          getType: "blobUrlsFromCellPairs",
          getArgs: { cellPairs: slicedSortedCellPairs },
        });
        const blobUrls = event.data.getResult;
        const newTileState = await replaceUnclassifiedTileStatePromise(
          tileState,
          blobUrls,
          slicedSortedCellPairs
        );

        setTileState(newTileState);
        setFetching(false);
        break;
      }
      case "ImageNumber": {
        let event = await workerActionPromise(dataWebWorker, "get", {
          getType: "cellPairsFromImage",
          getArgs: { ImageNumber: selectedFetchImageNumber },
        });
        const { getResult: cellPairs } = event.data;
        // console.log(cellPairs);
        if (cellPairs.length === 0) {
          alert(
            `No Cells Found With Image Number: ${selectedFetchImageNumber}`
          );
          setFetching(false);
          return;
        }

        let shuffledSliceCellPairs = cellPairs;

        if (cellPairs.length > 16) {
          const cellPairIndicesLeft = new Array(cellPairs.length)
            .fill(0)
            .map((e, i) => i);
          shuffledSliceCellPairs = [];
          while (shuffledSliceCellPairs.length < 16) {
            const randomIndexIndex = Math.floor(
              Math.random() * cellPairIndicesLeft.length
            );
            const randomIndex = cellPairIndicesLeft[randomIndexIndex];
            shuffledSliceCellPairs.push(cellPairs[randomIndex]);
            cellPairIndicesLeft.splice(randomIndexIndex, 1);
          }
        }

        const slicedCellPairs = shuffledSliceCellPairs.slice(0, 16);
        event = await workerActionPromise(canvasWebWorker, "get", {
          getType: "blobUrlsFromCellPairs",
          getArgs: { cellPairs: slicedCellPairs },
        });
        const blobUrls = event.data.getResult;
        const newTileState = await replaceUnclassifiedTileStatePromise(
          tileState,
          blobUrls,
          slicedCellPairs
        );
        setTileState(newTileState);
        setFetching(false);
        break;
      }
      case "TrainingPositive":
      case "TrainingNegative": {
        const cellPairs = trainingObject.trainingData.map((dataRow) => ({
          ImageNumber: dataRow[0],
          ObjectNumber: dataRow[1],
        }));

        const positiveCellPairs = cellPairs.filter(
          (e, idx) => trainingObject.trainingLabels[idx] === 1
        );
        const negativeCellPairs = cellPairs.filter(
          (e, idx) => trainingObject.trainingLabels[idx] === 0
        );

        const desiredCellPairs =
          fetchType === "TrainingPositive"
            ? positiveCellPairs
            : negativeCellPairs;

        let event = await workerActionPromise(canvasWebWorker, "get", {
          getType: "blobUrlsFromCellPairs",
          getArgs: { cellPairs: desiredCellPairs },
        });
        const blobUrls = event.data.getResult;
        const newTileState = await replaceUnclassifiedTileStatePromise(
          tileState,
          blobUrls,
          desiredCellPairs
        );
        setTileState(newTileState);
        setFetching(false);
        break;
      }
    }
  };

  const handleTrain = async () => {
    console.log("Train!");
    const positiveCellPairs = tileState.positive.map(
      (element) => element.cellPair
    );
    const negativeCellPairs = tileState.negative.map(
      (element) => element.cellPair
    );
    // console.log('p', positiveCellPairs, 'n', negativeCellPairs);

    const totalCellPairs = [...negativeCellPairs, ...positiveCellPairs];
    const newLabels = [
      ...new Array(negativeCellPairs.length).fill(0),
      ...new Array(positiveCellPairs.length).fill(1),
    ];

    setScoreTableIsUpToDate(false);

    const clearedUnclassifiedTileState = { ...tileState, unclassified: [] };
    setTileState(clearedUnclassifiedTileState);

    let event = await workerActionPromise(dataWebWorker, "get", {
      getType: "objectRowsFromCellpairs",
      getArgs: { cellPairs: totalCellPairs },
    });

    const { getResult: dataRows } = event.data;
    // console.log(dataRows);
    const newTrainingObject = {
      classifierType: "LogisticRegression",
      trainingData: dataRows,
      trainingLabels: newLabels,
      featureIndicesToUse: trainingObject.featureIndicesToUse,
    };
    trainSequencePromise(newTrainingObject);
  };

  const trainSequencePromise = async function (currentTrainingObject) {
    setOpenTrainDropdown(true);
    var UUID = null;
    let updateCanvasesListener = (event) => {
      if (UUID == event.data.uuid) {
        switch (event.data.action) {
          case "updateTrainingCanvases":
            tfvis.show.history(
              trainingLossCanvasParentRef.current,
              event.data.trainLogs,
              [...event.data.ticks.loss, ...event.data.ticks.accuracy]
            );
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

    return workerActionPromise(
      classifierWebWorker,
      "startTrainingGraphsConnection",
      {}
    )
      .then((event) => {
        UUID = event.data.uuid;
        classifierWebWorker.addEventListener("message", updateCanvasesListener);
        return workerActionPromise(classifierWebWorker, "train", {
          trainingObject: currentTrainingObject,
        });
      })
      .then(() => {
        workerActionPromise(
          classifierWebWorker,
          "endTrainingGraphsConnection",
          {}
        );
        classifierWebWorker.removeEventListener(
          "message",
          updateCanvasesListener
        );
        return workerActionPromise(classifierWebWorker, "confusionMatrix");
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
          worker.removeEventListener("message", selfDestructingEventHandler);
          resolve(event);
        }
      };
      worker.addEventListener("message", selfDestructingEventHandler);

      worker.postMessage({ action, ...data, uuid: UUID });
    });
  };

  const handleUpload = async (eventObject) => {
    console.log("Upload!");
    setUploading(true);
    await workerActionPromise(dataWebWorker, "init", {
      fileListObject: eventObject.target.files,
    });
    let event = await workerActionPromise(dataWebWorker, "get", {
      getType: "trainingObject",
    });
    const initialTrainingObject = event.data.getResult;

    setUploading(false);
    setSuccess(true);
    setUploadButtonEnabled(false);

    await trainSequencePromise(initialTrainingObject);
    setInitialFetchingPositiveNegative(true);
    const cellPairs = initialTrainingObject.trainingData.map((dataRow) => ({
      ImageNumber: dataRow[0],
      ObjectNumber: dataRow[1],
    }));

    const positiveCellPairs = cellPairs.filter(
      (e, idx) => initialTrainingObject.trainingLabels[idx] === 1
    );
    const negativeCellPairs = cellPairs.filter(
      (e, idx) => initialTrainingObject.trainingLabels[idx] === 0
    );

    const totalCellPairs = [...negativeCellPairs, ...positiveCellPairs];

    event = await workerActionPromise(canvasWebWorker, "get", {
      getType: "blobUrlsFromCellPairs",
      getArgs: { cellPairs: totalCellPairs },
    });
    const blobUrls = event.data.getResult;

    const zeros = new Array(negativeCellPairs.length).fill(0);
    const ones = new Array(positiveCellPairs.length).fill(1);
    const classes = [...zeros, ...ones];

    const newTileState = await constructTileStatePromiseByClass(
      blobUrls,
      totalCellPairs,
      classes
    );
    setTileState(newTileState);
    setFetching(false);
    setInitialFetchingPositiveNegative(false);
    enableIterationButtons();
  };

  /*
		@param (Array<Array<any>>) data The 2D array of data to convert and download as csv
		@param? (Array<string>) headers The possible headers at the top of the fiile
		@return (string)
	*/
  const dataToCsvString = (data, headers = null) => {
    let csvContent = "";
    if (headers !== null) {
      csvContent += headers.join(",") + "\n";
    }
    csvContent += data.map((l) => l.join(",")).join("\n");
    // downloadFile('enrichmentScores', csvContent, '.csv');
    return csvContent;
  };

  const rows = [
    ["name1", "city1", "some other info"],
    ["name2", "city2", "more info"],
  ];
  const headers = ["a", "b", "c"];

  const handleScoreAll = async () => {
    console.log("Score All!");
    if (!scoreTableIsUpToDate && !currentlyScoring) {
      setCurrentlyScoring(true);
      // console.log('Score All!');
      return workerActionPromise(classifierWebWorker, "scoreObjectData").then(
        (event) => {
          const newScoreTableObject = event.data.scoreTableObject;
          // console.log(newScoreTableObject);
          const scoreDataRows = Object.keys(
            newScoreTableObject.imageToCountsMap
          ).map((key) => ({
            imageNumber: parseInt(key),
            total:
              newScoreTableObject.imageToCountsMap[key][0] +
              newScoreTableObject.imageToCountsMap[key][1],
            positive: newScoreTableObject.imageToCountsMap[key][1],
            negative: newScoreTableObject.imageToCountsMap[key][0],
            ratio: newScoreTableObject.ratios[key],
            adjustratio: newScoreTableObject.adjustedRatios[key],
          }));

          const alphaValue = newScoreTableObject.alphas[1];
          const betaValue = newScoreTableObject.alphas[0];

          // console.log(alphaValue);

          const adjustedRatiosData = Object.values(
            newScoreTableObject.adjustedRatios
          ).map((ratio) => ({
            x: ratio,
          }));
          setHistogramData(adjustedRatiosData);
          setScoreTable(scoreDataRows);
          setCurrentlyScoring(false);
          setAlpha(alphaValue);
          setBeta(betaValue);
          // setScoreTableObject(newScoreTableObject);
          setScoreAlphas(newScoreTableObject.alphas);
          // console.log(newScoreTableObject);
          const headers = [
            "ImageNumber",
            "PositiveCount",
            "NegativeCount",
            "TotalCount",
            "Ratio",
            "AdjustedRatio",
          ];
          const csvdata = scoreDataRows.map((dataRow) => [
            dataRow.imageNumber,
            dataRow.positive,
            dataRow.negative,
            dataRow.total,
            dataRow.ratio,
            dataRow.adjustratio,
          ]);
          // const onDownload = () => {
          // 	downloadDataAsCSV(csvdata, headers);
          // };
          const csvContent = dataToCsvString(csvdata, headers);
          setScoreTableCsvString(csvContent);
          // setDownloadScoreTableFunction(onDownload);
          setScoreTableIsUpToDate(true);
        }
      );
    }
  };

  /**
   * @param {{positive: {data: {ImageNumber: cellPair.ImageNumber,ObjectNumber: number,Plate: numbere,Well: number,Gene: string,Puro: number,X: number,Y: number}}[],
   * 			negative: {data: {ImageNumber: cellPair.ImageNumber,ObjectNumber: number,Plate: numbere,Well: number,Gene: string,Puro: number,X: number,Y: number}}[],
   * 			unclassified: {data: {ImageNumber: cellPair.ImageNumber,ObjectNumber: number,Plate: numbere,Well: number,Gene: string,Puro: number,X: number,Y: number}}[]
   * 			}}
   * 			tileState The tile state of arrays of cell objects for each class, a data field for each cell object gives us
   * 			the information needed to make the trainingset text content
   * @return {string} tileStateString
   */
  function createTrainingSetTextFromTileState(tileState) {
    let result = "";
    result = result.concat(
      `# This training set was created at ${new Date().toLocaleString()} in CellProfiler Analyst Web\n`
    );
    result = result.concat("label positive negative\n");

    for (let i = 0; i < tileState.positive.length; i++) {
      const cellData = tileState.positive[i].data;
      result = result.concat(
        `positive ${cellData.ImageNumber} ${cellData.ObjectNumber} ${cellData.X} ${cellData.Y}\n`
      );
    }

    for (let i = 0; i < tileState.negative.length; i++) {
      const cellData = tileState.negative[i].data;
      result = result.concat(
        `negative ${cellData.ImageNumber} ${cellData.ObjectNumber} ${cellData.X} ${cellData.Y}\n`
      );
    }

    return result;
  }

  const handleDownload = async (downloadType) => {
    console.log("Download!");
    if (downloadType === "TrainingSet") {
      const trainingSetText = createTrainingSetTextFromTileState(tileState);
      downloadFile("generatedTrainingSet", trainingSetText, ".txt");
      return;
    } else if (downloadType === "ClassifierSpec") {
      return workerActionPromise(classifierWebWorker, "getClassifier").then(
        (event) => {
          tf.loadLayersModel(
            `indexeddb://${trainingObject.classifierType}`
          ).then((model) => {
            model.save(`downloads://${trainingObject.classifierType}`);
          });
        }
      );
    } else if (downloadType === "TrainingSetClassifierSpec") {
      const trainingSetText = createTrainingSetTextFromTileState(tileState);
      downloadFile("generatedTrainingSet", trainingSetText, ".txt");
      return workerActionPromise(classifierWebWorker, "getClassifier").then(
        (event) => {
          tf.loadLayersModel(
            `indexeddb://${trainingObject.classifierType}`
          ).then((model) => {
            model.save(`downloads://${trainingObject.classifierType}`);
          });
        }
      );
    } else {
      console.error("no valid downloadtype");
    }

    // const classifier = event.data.classifier;
  };

  async function constructTileStatePromise(dataURLs, newCellPairs) {
    const cellDatas = await Promise.all(
      newCellPairs.map((cellPair) =>
        workerActionPromise(dataWebWorker, "get", {
          getType: "cellPairData",
          getArgs: { cellPair: cellPair },
        }).then((event) => event.data.getResult)
      )
    );

    return {
      unclassified: dataURLs.map((dataURL, idx) => {
        const cellData = cellDatas[idx];

        const label = `Ob: ${cellData.ObjectNumber}${"\u00A0"}Im: ${
          cellData.ImageNumber
        }${"\u000A"}something`;

        // We: ${cellData.Well}
        // Pl: ${cellData.Plate}`;
        // console.log(label);
        return {
          id: idx,
          address: dataURL,
          data: cellData,
          info: label,
          cellPair: {
            ImageNumber: cellData.ImageNumber,
            ObjectNumber: cellData.ObjectNumber,
          },
        };
      }),
      positive: [],
      negative: [],
    };
  }

  async function replaceUnclassifiedTileStatePromise(
    lastTileState,
    newDataURLs,
    newCellPairs
  ) {
    const cellDatas = await Promise.all(
      newCellPairs.map((cellPair) =>
        workerActionPromise(dataWebWorker, "get", {
          getType: "cellPairData",
          getArgs: { cellPair: cellPair },
        }).then((event) => event.data.getResult)
      )
    );
    for (let i = 0; i < lastTileState.negative.length; i++) {
      lastTileState.negative[i].id = i;
    }
    for (let i = 0; i < lastTileState.positive.length; i++) {
      lastTileState.positive[i].id = lastTileState.negative.length + i;
    }

    const unclassifiedTileState = newDataURLs.map((dataURL, idx) => {
      const cellData = cellDatas[idx];

      const label = `Ob: ${cellData.ObjectNumber} Im: ${cellData.ImageNumber}`;
      // We: ${cellData.Well}
      // Pl: ${cellData.Plate}`;
      // console.log(label);
      return {
        id: lastTileState.positive.length + lastTileState.negative.length + idx,
        address: dataURL,
        info: label,
        data: cellData,
        cellPair: {
          ImageNumber: cellData.ImageNumber,
          ObjectNumber: cellData.ObjectNumber,
        },
      };
    });

    // console.log(unclassifiedTileState, lastTileState);
    const newTileState = {
      negative: lastTileState.negative,
      positive: lastTileState.positive,
      unclassified: unclassifiedTileState,
    };
    // console.log(newTileState);
    return newTileState;
  }

  async function constructTileStatePromiseByClass(
    dataURLs,
    newCellPairs,
    classes
  ) {
    const cellDatas = await Promise.all(
      newCellPairs.map((cellPair) =>
        workerActionPromise(dataWebWorker, "get", {
          getType: "cellPairData",
          getArgs: { cellPair: cellPair },
        }).then((event) => event.data.getResult)
      )
    );

    const cellStates = dataURLs.map((dataURL, idx) => {
      const cellData = cellDatas[idx];

      const label = `Ob: ${cellData.ObjectNumber} Im: ${cellData.ImageNumber}`;
      // We: ${cellData.Well}
      // Pl: ${cellData.Plate}`;
      return {
        id: idx,
        address: dataURL,
        info: label,
        data: cellData,
        cellPair: {
          ImageNumber: cellData.ImageNumber,
          ObjectNumber: cellData.ObjectNumber,
        },
      };
    });

    const newTileState = {
      negative: cellStates.filter((e, idx) => classes[idx] === 0),
      positive: cellStates.filter((e, idx) => classes[idx] === 1),
      unclassified: cellStates.filter((e, idx) => classes[idx] === -1),
    };
    return newTileState;
  }

  function onChange(sourceId, sourceIndex, targetIndex, targetId) {
    if (targetId) {
      const result = move(
        tileState[sourceId],
        tileState[targetId],
        sourceIndex,
        targetIndex
      );
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
    handleCloseFetchDropDown("ImageNumber");
  };
  console.log("Load the App");
  return (
    <GridContextProvider onChange={onChange}>
      <CompatibilityCheck></CompatibilityCheck>
      <div style={{ overflowX: "hidden", height: "100%", width: "100%" }}>
        <Row style={{ marginTop: "2%" }}>
          <Image
            src={logo}
            style={{
              marginLeft: "11%",
              height: "30%",
              width: "25%",
              position: "relative",
              maxHeight: "125px",
              marginBottom: "2%",
            }}
          ></Image>
          <Col style={{ left: "35%" }}>
            <Help></Help>
          </Col>

          <Col style={{ left: "20%", right: 5 }}>
            <UploadButton
              handleUpload={handleUpload}
              uploadButtonEnabled={uploadButtonEnabled}
              uploading={uploading}
              success={success}
            ></UploadButton>
          </Col>
          <Col style={{ left: "5%" }}>
            <DownloadButton
              downloadButtonEnabled={downloadButtonEnabled}
              handleDownload={handleDownload}
            ></DownloadButton>
          </Col>
        </Row>

        <Row>
          <Paper
            variant="outlined"
            //color="primary"
            //elevation={3}
            style={{
              marginLeft: "30%",
              marginRight: "30%",
              height: 75,
              width: 550,
              outlineColor: "#6697CD",
              //boxShadow: "0px 3px 1px -2px #6697CD,0px 2px 2px 0px #6697CD ,0px 1px 5px 0px #6697CD"
            }}
          >
            <Grid
              container
              justify="center"
              spacing={2}
              style={{ marginBottom: 10, marginTop: 10 }}
            >
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
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCloseFetchDropDown(null);
                  }}
                >
                  <MenuItem onClick={() => handleCloseFetchDropDown("Random")}>
                    Random
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleCloseFetchDropDown("Positive")}
                  >
                    Positive
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleCloseFetchDropDown("Negative")}
                  >
                    Negative
                  </MenuItem>
                  <MenuItem onClick={handleClickOpenImNumFetchDropdown}>
                    By Image
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleCloseFetchDropDown("Confusing")}
                  >
                    Confusing
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleCloseFetchDropDown("MorePositive")}
                  >
                    Most Positive
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleCloseFetchDropDown("MoreNegative")}
                  >
                    Most Negative
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleCloseFetchDropDown("TrainingPositive")}
                  >
                    Training Set Positive
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleCloseFetchDropDown("TrainingNegative")}
                  >
                    Training Set Negative
                  </MenuItem>

                  <Dialog
                    open={openFetchDropdown}
                    onClose={() => handleCloseFetchDropDown(null)}
                  >
                    <DialogTitle>
                      {/* <Typography variant="h3" align="center"> */}
                      Fetch By Image
                      {/* </Typography> */}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Select the image number you would like to fetch from.
                      </DialogContentText>
                      <form
                        noValidate
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleClickCloseImNumFetchDropdown();
                        }}
                      >
                        <FormControl>
                          <TextField
                            onChange={(event) => {
                              if (
                                event.target.value === null ||
                                event.target.value === undefined ||
                                event.target.value === ""
                              ) {
                                return;
                              }
                              setSelectedFetchImageNumber(
                                parseInt(event.target.value)
                              );
                              setFetchImageNumberButtonEnabled(true);
                            }}
                            type="number"
                            inputProps={{ step: 1, min: 1 }}
                            value={selectedFetchImageNumber}
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
                <Button
                  disabled={!trainButtonEnabled}
                  variant="contained"
                  onClick={handleTrain}
                >
                  Train
                </Button>
                <Dialog fullWidth={500} open={openTrainDropdown}>
                  <DialogTitle>Training the Classifier</DialogTitle>
                  <DialogContent>
                    <div
                      width={300}
                      ref={trainingAccuracyCanvasParentRef}
                    ></div>
                    <div width={300} ref={trainingLossCanvasParentRef}></div>
                  </DialogContent>
                </Dialog>
              </Grid>

              <Grid key={2} item>
                {/* <Button disabled={!evaluateButtonEnabled} variant="contained" onClick={()=>{}}>Evaluate</Button>  */}
                {/* TODO: need to fix button disabled DONE*/}
                {!evaluateButtonEnabled ? (
                  <Button
                    disabled={!evaluateButtonEnabled}
                    variant="contained"
                    onClick={() => {}}
                  >
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
                  <Button
                    disabled={!evaluateButtonEnabled}
                    variant="contained"
                    onClick={handleScoreAll}
                  >
                    Score All
                  </Button>
                ) : (
                  <ScoreAll
                    histogramData={histogramData}
                    scoreTable={scoreTable}
                    handleScoreAll={handleScoreAll}
                    scoreTableIsUpToDate={scoreTableIsUpToDate}
                    // downloadScoreTableFunction={downloadScoreTableFunction}
                    scoreTableCsvString={scoreTableCsvString}
                    alphas={scoreAlphas}
                    handleOpenBigPicture={handleOpenBigPicture}
                  ></ScoreAll>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Row>

        <div>
          <label
            style={{
              textAlign: "left",
              backgroundColor: "white",
              paddingLeft: "10%",
              marginBottom: "0.5%",
              userSelect: "none",
            }}
          >
            Unclassified{" "}
          </label>

          <div>
            <GridDropZone
              className="dropzone "
              id="unclassified"
              boxesPerRow={8}
              rowHeight={80}
              style={{
                height: "20vw",
                maxHeight: 200,
                minHeight: 150,
                marginBottom: 10,
                marginLeft: "10%",
                width: "80%",
              }}
            >
              {!fetching ? (
                tileState.unclassified.map((item) => (
                  <GridItem
                    className="hoverTest"
                    style={{
                      height: "15vw",
                      width: "15vw",
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
                        onDoubleClick={() => {
                          // console.log('double click: ' + item.info);
                          handleOpenCellBigPicture(item.cellPair);
                        }}
                        className="grid-item-content"
                        style={{
                          backgroundImage: `url(${item.address})`,
                          height: "5vw",
                          width: "5vw",
                        }}
                      >
                        <span className="hoverText">{item.info}</span>
                      </div>
                    </div>
                  </GridItem>
                ))
              ) : (
                <CircularProgress
                  style={{
                    height: "6vw",
                    width: "6vw",
                    marginTop: "6%",
                    marginLeft: "45%",
                  }}
                />
              )}
            </GridDropZone>
            <Dialog
              style={{ alignItems: "center" }}
              onClose={handleCloseCellBigPicture}
              // fullWidth={480}
              // maxWidth={480}
              open={cellBigPictureDialogOpen}
            >
              <DialogTitle>{bigPictureTitle}</DialogTitle>
              {/* <DialogTitle>Loss and Accuracy</DialogTitle> */}
              <DialogContent
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <img width={430} height={430} src={bigPictureSource}></img>
              </DialogContent>
            </Dialog>
          </div>

          <Row>
            <label
              style={{
                textAlign: "left",
                backgroundColor: "white",
                paddingLeft: "11%",
                userSelect: "none",
                marginBottom: "0.5%",
                marginTop: 0,
              }}
            >
              Positive
            </label>

            <label
              style={{
                textAlign: "left",
                backgroundColor: "white",
                paddingRight: "8%",
                userSelect: "none",
                margin: "auto",
                marginBottom: "0.5%",
                marginTop: 0,
              }}
            >
              Negative
            </label>
          </Row>

          <Row>
            <div style={{ width: "39%", marginLeft: "11%" }}>
              <div
                style={{
                  height: "200px",
                  width: "100%",
                  overflowY: "scroll",
                  overflowX: "hidden",
                  // msOverflowY: 'scroll',
                  // msOverflowStyle: 'none',

                  // scrollbarWidth: 'none',
                }}
              >
                <GridDropZone
                  className="dropzone positive"
                  id="positive"
                  boxesPerRow={4}
                  rowHeight={80}
                  style={{
                    height: 80 * Math.floor(tileState.positive.length / 4 + 1),
                    minHeight: 240,
                    width: "100%",
                    overflowY: "hidden",
                    // marginLeft: '22%',
                    alignSelf: "flex-end",
                    // marginRight: '11%',
                  }}
                >
                  {!initialFetchingPositiveNegative ? (
                    tileState.positive.map((item) => (
                      <GridItem
                        className="hoverTest"
                        style={{
                          height: "15vw",
                          width: "15vw",
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
                            onDoubleClick={() => {
                              // console.log('double click: ' + item.info);
                              handleOpenCellBigPicture(item.cellPair);
                            }}
                            className="grid-item-content"
                            style={{
                              backgroundImage: `url(${item.address})`,
                              height: "5vw",
                              width: "5vw",
                            }}
                          >
                            <span className="hoverText">{item.info}</span>
                          </div>
                        </div>
                      </GridItem>
                    ))
                  ) : (
                    <CircularProgress
                      style={{
                        height: "6vw",
                        width: "6vw",
                        marginTop: "15%",
                        marginLeft: "43%",
                      }}
                    />
                  )}
                </GridDropZone>
              </div>
            </div>
            <div style={{ width: "39%", marginRight: "11%" }}>
              <div
                style={{
                  height: "200px",
                  width: "100%",
                  overflowY: "scroll",
                  overflowX: "hidden",

                  // msOverflowY: 'scroll',
                  // msOverflowStyle: 'none',

                  // scrollbarWidth: 'none',
                }}
              >
                <GridDropZone
                  className="dropzone negative"
                  id="negative"
                  boxesPerRow={4}
                  rowHeight={80}
                  style={{
                    height: 80 * Math.floor(tileState.negative.length / 4 + 1),
                    minHeight: 240,
                    marginRight: "22%",
                    width: "100%",
                    overflowY: "hidden",
                    alignSelf: "flex-start",
                  }}
                >
                  {!initialFetchingPositiveNegative ? (
                    tileState.negative.map((item) => (
                      <GridItem
                        className="hoverTest"
                        style={{
                          height: "15vw",
                          width: "15vw",
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
                            onDoubleClick={() => {
                              // console.log('double click: ' + item.info);
                              handleOpenCellBigPicture(item.cellPair);
                            }}
                            className="grid-item-content"
                            style={{
                              backgroundImage: `url(${item.address})`,
                              height: "5vw",
                              width: "5vw",
                            }}
                          >
                            <span className="hoverText">{item.info}</span>
                          </div>
                        </div>
                      </GridItem>
                    ))
                  ) : (
                    <CircularProgress
                      style={{
                        height: "6vw",
                        width: "6vw",
                        marginTop: "15%",
                        marginLeft: "43%",
                      }}
                    />
                  )}
                </GridDropZone>
              </div>
            </div>
          </Row>
        </div>
      </div>
      {/* </Paper> */}
    </GridContextProvider>
  );
}

export default TestUIMVP;

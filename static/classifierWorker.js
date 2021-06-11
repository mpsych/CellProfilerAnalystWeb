// import tensorflow
self.importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
self.importScripts('classifierWorkerUtils.js');
// self.importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-vis")
console.log(typeof tf !== 'undefined' ? 'TensorFlow Loaded In WebWorker' : 'TensorFlow Failed To Load In WebWorker');
// console.log(typeof tfvis !== "undefined"? "TensorFlow-Visor Loaded In WebWorker" : "TensorFlow-Visor Failed To Load In WebWorker")
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuid.min.js');
self.canvasUUID = null;
console.log('Classifier WebWorker Loaded');
self.onmessage = async (event) => {
	switch (event.data.action) {
		case 'init':
			break;

		case 'train':
			const { trainingObject } = event.data;
			// const featureIndices = [30,31]
			const featureIndices = trainingObject.featureIndicesToUse;
			self.classifierType = trainingObject.classifierType;
			self.featureIndices = featureIndices;
			const batchSize = 32;
			self.trainingData = trainingObject.trainingData;
			self.trainingLabels = trainingObject.trainingLabels;
			const learningRate = 0.001;
			self.classifier = self.createLogisticRegressionModel(featureIndices.length, learningRate);
			const numberEpochs = 100;
			const tf_dataset = self.createDatasetFromDataArrays(
				trainingData,
				trainingLabels,
				featureIndices,
				batchSize
			);
			// mutates model to be trained
			await self.basicTrainPromise(self.classifier, tf_dataset, numberEpochs);

			const testDataTensor = self.createTestset(trainingData, featureIndices);

			const predictions = self.predict(self.classifier, testDataTensor);
			self.confusionMatrix = self.createConfusionMatrix(predictions, trainingLabels);

			self.postMessage({ uuid: event.data.uuid });
			break;

		case 'confusionMatrix':
			self.postMessage({ confusionMatrix: self.confusionMatrix, uuid: event.data.uuid });
			break;

		case 'predictFilterCellPairs': {
			const { cellPairs } = event.data;
			const { classType } = event.data;
			const UUID = event.data.uuid;
			if (cellPairs.length === 0) {
				self.postMessage({ filteredCellPairs: [], uuid: UUID });
				return;
			}
			self.workerActionPromise(dataWorkerPort, 'get', {
				getType: 'objectRowsFromCellpairs',
				getArgs: { cellPairs },
			}).then((event) => {
				const objectRows = event.data.getResult;
				const testDataTensor = self.createTestset(objectRows, self.featureIndices);

				const predictions = self.predict(self.classifier, testDataTensor);

				const labelsToLookFor = classType === 'Positive' ? 1 : 0;
				const includeCellPairs = predictions.map((e) => e === labelsToLookFor);
				const filteredCellPairs = cellPairs.filter((element, idx) => includeCellPairs[idx]);
				self.postMessage({ filteredCellPairs, uuid: UUID });
			});
			break;
		}
		case 'confusingSortCellPairs': {
			const { cellPairs } = event.data;
			const { uuid: UUID } = event.data;
			const cellPairIndices = cellPairs.map((e, idx) => idx);

			self.workerActionPromise(dataWorkerPort, 'get', {
				getType: 'objectRowsFromCellpairs',
				getArgs: { cellPairs },
			}).then((event) => {
				const objectRows = event.data.getResult;

				const testDataTensor = self.createTestset(objectRows, self.featureIndices);

				const confuseFactors = self.predictConfusing(self.classifier, testDataTensor);

				const sortedCellPairs = [...cellPairIndices]
					.sort((i1, i2) => confuseFactors[i1] - confuseFactors[i2])
					.map((index) => cellPairs[index]);

				self.postMessage({ sortedCellPairs, uuid: UUID });
			});
			break;
		}
		case 'moreClassSortCellPairs': {
			const { cellPairs } = event.data;
			const { classType } = event.data;
			const { uuid: UUID } = event.data;
			const cellPairIndices = cellPairs.map((e, idx) => idx);

			let sortingFactor = 0;
			if (classType === 'Positive') {
				// 1 is ascending
				sortingFactor = 1;
			} else if (classType === 'Negative') {
				// -1 is descending
				sortingFactor = -1;
			} else {
				throw new Error(
					`Incorrect classType: ${classType} passed to mostClassFilterCellPairs in classifierWorker`
				);
			}
			self.workerActionPromise(dataWorkerPort, 'get', {
				getType: 'objectRowsFromCellpairs',
				getArgs: { cellPairs },
			}).then((event) => {
				const objectRows = event.data.getResult;

				const testDataTensor = self.createTestset(objectRows, self.featureIndices);

				const classFactors = self.predictClass(self.classifier, testDataTensor);
				const sortedCellPairs = [...cellPairIndices]
					.sort((i1, i2) => sortingFactor * (classFactors[i1] - classFactors[i2]))
					.map((index) => cellPairs[index]);

				self.postMessage({ sortedCellPairs, uuid: UUID });
			});
			break;
		}
		case 'connectToDataWorker':
			self.dataWorkerPort = event.ports[0];
			self.dataWorkerPort.onmessage = handleDataWorkerMessage;
			break;
		case 'testSendToDataWorker':
			self.dataWorkerPort.postMessage({ test: 'test' });
			break;
		case 'startTrainingGraphsConnection':
			self.canvasUUID = event.data.uuid;
			self.postMessage({ uuid: event.data.uuid });
			break;
		case 'endTrainingGraphsConnection':
			self.canvasUUID = null;
			self.postMessage({ uuid: event.data.uuid });
			break;
		case 'printObjectDataRow':
			self.dataWorkerPort.postMessage({ action: 'sendObjectData', subAction: 'printObjectDataRow' });
			break;
		case 'scoreObjectData':
			const UUID = event.data.uuid;
			self.workerActionPromise(dataWorkerPort, 'get', {
				getType: 'objectData',
			}).then((event) => {
				const objectData = event.data.getResult;
				const testDataTensor = self.createTestset(objectData, self.featureIndices);
				const objectPredictions = self.predict(self.classifier, testDataTensor);
				const imageToCountsMap = {};
				for (var i = 0; i < objectPredictions.length; i++) {
					const imageNumber = objectData[i][0];
					if (imageToCountsMap[imageNumber] === undefined) {
						imageToCountsMap[imageNumber] = [0, 0];
					}
					imageToCountsMap[imageNumber][objectPredictions[i]]++;
				}
				const imageNumbers = Object.keys(imageToCountsMap);
				const counts = imageNumbers.map((imageNumber) => imageToCountsMap[imageNumber]);

				const alphas = self.fitBetaDistribution(counts);

				var ratios = {};
				for (var i = 0; i < imageNumbers.length; i++) {
					const imageNumber = imageNumbers[i];
					const negativeCount = imageToCountsMap[imageNumber][0];
					const positiveCount = imageToCountsMap[imageNumber][1];
					const totalCount = positiveCount + negativeCount;
					ratios[imageNumber] = positiveCount / totalCount;
				}

				var adjustedRatios = {};
				for (var i = 0; i < imageNumbers.length; i++) {
					const imageNumber = imageNumbers[i];
					const negativeCount = imageToCountsMap[imageNumber][0];
					const positiveCount = imageToCountsMap[imageNumber][1];
					const totalCount = positiveCount + negativeCount;
					// choose the alpha corresponding to the 1-index positive
					adjustedRatios[imageNumber] = (positiveCount + alphas[1]) / (totalCount + alphas[1] + alphas[0]);
				}

				const scoreTableObject = {
					imageToCountsMap,
					alphas,
					ratios,
					adjustedRatios,
				};

				self.postMessage({ scoreTableObject, uuid: UUID });
			});
			break;
		case 'getClassifier':
			self.classifier.save(`indexeddb://${self.classifierType}`).then(() => {
				self.postMessage({ uuid: event.data.uuid });
			});
			// self.postMessage({ classifier: self.classifier, uuid: event.data.uuid });

			break;
		case 'trainAndPredict':
			console.log('initial entry train and predict classifierworker send to dataworker for object data');

			self.dataWorkerActionPromise('getObjectData', async (event) => {
				const featureIndices = [30, 31];
				const batchSize = 32;
				const objectDataSubset = event.data.objectData.slice(0, 100);
				const labels = new Array(objectDataSubset.length).fill(1);
				const model = self.createLogisticRegressionModel(featureIndices.length);
				const numberEpochs = 20;
				const tf_dataset = self.createDatasetFromDataArrays(
					objectDataSubset,
					labels,
					featureIndices,
					batchSize
				);
				// mutates model to be trained
				await self.basicTrainPromise(model, tf_dataset, numberEpochs);

				const testDataTensor = self.createTestset(event.data.objectData, featureIndices);
				self.classifier = model;
			});
			break;

		default:
			console.log('unhandled event: ', event.data);
			self.postMessage({ uuid: event.data.uuid });
	}
};

self.workerActionPromise = function (worker, action, data) {
	const { v4: uuidv4 } = uuid;
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

self.dataWorkerActionPromise = function (action, callback) {
	const { v4: uuidv4 } = uuid;
	const UUID = uuidv4();

	return new Promise((resolve) => {
		self.dataWorkerPort.addEventListener(
			'message',
			(event) => {
				if (event.data.uuid === UUID) {
					resolve(callback(event));
				} else {
					console.log('DataWorkerActionPromise: ' + UUID, 'Skipped non-uuid call');
				}
			},
			{ once: true }
		);
		self.dataWorkerPort.postMessage({ action: action, uuid: UUID });
	});
};

self.handleDataWorkerMessage = function (event) {
	switch (event.data.action) {
		case 'printObjectDataRow':
			break;
		case 'trainAndPredict':
			const featureIndices = [30, 31];
			const batchSize = 32;
			const objectDataSubset = event.data.objectData.slice(0, 100);
			const labels = new Array(objectDataSubset.length).fill(1);
			const model = self.createLogisticRegressionModel(featureIndices.length);
			const numberEpochs = 20;
			const tf_dataset = self.createDatasetFromDataArrays(objectDataSubset, labels, featureIndices, batchSize);
			// mutates model to be trained
			self.basicTrainPromise(model, tf_dataset, numberEpochs).then(() => {
				const testDataTensor = self.createTestset(event.data.objectData, featureIndices);
			});
			break;
		default:
			break;
	}
};

/*
    @param {int} featureCount The number of input features to the model
    @return {tf.sequential} model The TensorFlow LogisticRegression model
*/
self.createLogisticRegressionModel = function (featureCount, learningRate = 0.01) {
	const model = tf.sequential();

	model.add(
		tf.layers.dense({
			units: 2,
			activation: 'softmax',
			inputShape: [featureCount],
			kernelRegularizer: tf.regularizers.l1({ l1: 0.1 }),
		})
	);

	const optimizer = tf.train.adam(learningRate);
	model.compile({
		optimizer: optimizer,
		loss: 'binaryCrossentropy',
		metrics: ['accuracy'],
	});

	return model;
};

/*
    @param {tf.sequential} model The model to do prediction with
    @param {Tensor<Tensor<number>>} testDataTensor The 2D Tensor of data with feature columns and entry rows to predict labels for
    @return {Array<(0|1)>} predictions The array of 0s and 1s corresponding to the model's predictions on the testDataArray 
*/
self.predict = function (model, testDataTensor) {
	const tf_predictions = model.predict(testDataTensor).argMax(-1);
	return tf_predictions.arraySync();
};

/*
    @param {tf.sequential} model The model to do prediction with
    @param {Tensor<Tensor<number>>} testDataTensor The 2D Tensor of data with feature columns and entry rows to predict labels for
    @return {Array<number>} confuseFactors The Array of numbers between 0 and 1 where closer to 0 is more confusing
*/
self.predictConfusing = function (model, testDataTensor) {
	const tf_predictions = model.predict(testDataTensor);
	const confuseFactors = tf_predictions.arraySync().map((e) => Math.abs(e[0] - 0.5));
	return confuseFactors;
};

/**
 *
 * @return {number[]} classFactors The Array of numbers between 0 and 1 where closer to 0 is more
 * 						negative for the phenotype and closer to 1 is more positive
 */
self.predictClass = function (model, testDataTensor) {
	const tf_predictions = model.predict(testDataTensor);
	const classFactors = tf_predictions.arraySync().map((e) => e[0]);
	return classFactors;
};

self.basicTrainPromise = function (model, training_dataset, number_epochs) {
	const trainLogs = [];
	return new Promise((resolve, reject) => {
		model.fitDataset(training_dataset, {
			epochs: number_epochs,
			callbacks: {
				onEpochEnd: (epoch, logs) => {
					trainLogs.push(logs);
					if (self.canvasUUID && epoch % 5 === 0) {
						self.postMessage({
							uuid: self.canvasUUID,
							action: 'updateTrainingCanvases',
							trainLogs,
							ticks: { accuracy: ['acc'], loss: ['loss'] },
						});
					}
				},
				onTrainEnd: () => resolve(),
			},
		});
	});
};

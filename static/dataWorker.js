//import UploadHandler
self.importScripts('UploadHandler2.js');
//self.importScripts('UserUploadFileHandler2.js')
self.initialized = false;

self.onmessage = async (event) => {
	switch (event.data.action) {
		case 'init':
			console.time('init');
			const { fileListObject } = event.data;
			if (fileListObject === undefined || fileListObject === null) {
				throw new Error('[dataWebWorker] fileListObject not defined');
			}
			self.fileHandler = new UserUploadFileHandler2(fileListObject);
			const uploadHandler = new UploadHandler2(event.data.fileListObject);
			const uploadReturnObject = await uploadHandler.getDataProvider();
			self.dataProvider = uploadReturnObject
			const trainingTable = await uploadHandler.getTrainingSet();
			const trainingDataTable = trainingTable.getDataColumnsPaired();
			const trainingLabels = trainingTable.getTrainingLabels();
			const initialTrainingData = trainingTable.getInitialTrainingData(dataProvider)
			const totalFeatures = dataProvider.getColumnLines('object_data');
			const featureIsUsed = (feature) =>
				!feature.includes('Location') && feature !== 'ObjectNumber' && feature !== 'ImageNumber';
			const tempIndices = totalFeatures.map((feature, idx) => (featureIsUsed(feature) ? idx : -1));
			// console.log(tempIndices, featureIsUsed('a'), featureIsUsed('Location'));
			const featureIndicesToUse = tempIndices.filter((index) => !(index === -1));
			// console.log(featureIndicesToUse);
			self.initialTrainingObject = {
				classifierType: 'LogisticRegression',
				trainingData: initialTrainingData,
				trainingLabels,
				featureIndicesToUse,
			};

			self.postMessage(event.data);
			console.timeEnd('init');
			break;
		case 'connectToClassifierWorker':
			self.classifierWorkerPort = event.ports[0];
			self.classifierWorkerPort.onmessage = handleClassifierWorkerMessage;
			break;
		case 'connectToCanvasWorker':
			self.canvasWorkerPort = event.ports[0];
			self.canvasWorkerPort.onmessage = handleCanvasWorkerMessage;
			break;
		case 'get':
			const result = self.fulfillAction(event);
			self.postMessage({ getResult: result, uuid: event.data.uuid });
			break;
		default:
			console.log('unhandled event: ' + event.data);
	}
};

self.fulfillAction = function (event) {
	// console.log("fulfillAction enter")
	// console.log(event.data)
	switch (event.data.action) {
		case 'getObjectData':
			return self.dataProvider.getDataLines('object_data');
		case 'getObjectRow':
			const { ImageNumber, ObjectNumber } = event.data.cellPair;
			return self.dataProvider.getRow('object_data', { ImageNumber, ObjectNumber });
		case 'getTrainingObject':
			return self.initialTrainingObject;
		case 'get':
			switch (event.data.getType) {
				case 'coordsFromCellPair': {
					const { cellPair } = event.data.getArgs;
					return self.dataProvider.getCoordsforCellDisplay(cellPair);
				}
				case 'pathsObjectFromImageNumber': {
					const { imageNumber } = event.data.getArgs;

					return self.dataProvider.returnAllImgFileNames(imageNumber);
				}
				case 'fileFromFileName': {
					const { fileName } = event.data.getArgs;
					return self.fileHandler.findFile(fileName);
				}
				case 'trainingObject':
					return self.initialTrainingObject;
				case 'cellPairs': {
					const { amount } = event.data.getArgs;
					const randomCellPairs = self.dataProvider.getNRandomObjs(amount);
					return randomCellPairs;
				}
				case 'objectRowsFromCellpairs': {
					const { cellPairs } = event.data.getArgs;
					return cellPairs.map((cellPair) => self.dataProvider.getRowArray('object_data', cellPair));
				}
				case 'objectData':
					return self.dataProvider.getDataLines('object_data');
				case 'cellPairsFromImage': {
					const ImageNumber = parseInt(event.data.getArgs.ImageNumber);
					// console.log(ImageNumber);
					const objectData = self.dataProvider.getDataLines('object_data');
					// console.log(objectData);
					console.log(objectData[200][0], ImageNumber, objectData[200][0] === ImageNumber);
					console.log(typeof (objectData[200][0], typeof ImageNumber));
					const filteredObjectData = objectData.filter((row) => row[0] === ImageNumber);
					console.log(filteredObjectData);
					const filteredCellPairs = filteredObjectData.map((row) => ({ ImageNumber, ObjectNumber: row[1] }));
					console.log(filteredCellPairs);
					return filteredCellPairs;
				}
				case 'cellPairData': {
					console.log('cellPairData');
					const cellPair = {
						ImageNumber: parseInt(event.data.getArgs.cellPair.ImageNumber),
						ObjectNumber: parseInt(event.data.getArgs.cellPair.ObjectNumber),
					};
					console.log(cellPair);
					const imageDataRow = this.dataProvider.getRow('image_data', { ImageNumber: cellPair.ImageNumber });
					console.log(imageDataRow);

					const cellData = {
						ImageNumber: cellPair.ImageNumber,
						ObjectNumber: cellPair.ObjectNumber,
						Plate: imageDataRow.plate,
						Well: imageDataRow.well,
						Gene: imageDataRow.gene,
						Puro: imageDataRow.puro,
					};
					console.log(cellData);
					return cellData;
				}
			}
		case 'test':
			return 'data test';
	}
};

const handleClassifierWorkerMessage = function (event) {
	console.log('data worker received classifier worker data');
	// console.log(event.data)

	switch (event.data.action) {
		case 'getObjectData':
			console.log('dataworker to classifierworker: fulfill getObjectData');
			self.classifierWorkerPort.postMessage({
				action: event.data.action,
				uuid: event.data.uuid,
				objectData: self.dataProvider.getDataLines('object_data'),
			});
			break;
		case 'get':
			const result = self.fulfillAction(event);
			self.classifierWorkerPort.postMessage({ getResult: result, uuid: event.data.uuid });
			break;
		// case "getObjectRow":
	}
};

const handleCanvasWorkerMessage = function (event) {
	const postResult = self.fulfillAction(event);
	// console.log("fulfillAction exit")
	const { uuid } = event.data;
	// console.log(postResult, uuid)
	self.canvasWorkerPort.postMessage({ postResult, uuid });
}
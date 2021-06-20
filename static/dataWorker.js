self.importScripts('PropertiesDrivenUploadHandler.js');
self.importScripts('UserUploadFileHandler.js');
self.initialized = false;

self.onmessage = async (event) => {
	switch (event.data.action) {
		case 'init':
			console.time('init');
			const { fileListObject } = event.data;
			if (!fileListObject) {
				throw new Error('[dataWebWorker] fileListObject not defined');
			}
			self.fileHandler = new UserUploadFileHandler(fileListObject);
			const uploadHandler = await PropertiesDrivenUploadHandler.create(self.fileHandler);
			self.dataProvider = await uploadHandler.getDataProvider();

			self.initialTrainingObject = await uploadHandler.getInitialTrainingObject(self.dataProvider);
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
		case 'testSendToClassifierWorker':
			self.classifierWorkerPort.postMessage({ test: 'test' });
			break;
		case 'printObjectDataRow':
			console.log(self.dataProvider.getObjectLines()[event.data.index]);
			break;
		// case "trainAndPredict":
		//     self.postMessage({action: "trainAndPredict", objectData:self.objectData})
		//     break;
		case 'sendObjectData':
			self.postMessage({ action: 'sendObjectData', objectData: self.dataProvider.getDataLines('object_data') });
			break;
		case 'getObjectRow':
			const searchObject = { ObjectNumber: event.data.ObjectNumber, ImageNumber: event.data.ImageNumber };
			self.postMessage({
				action: 'sendObjectData',
				objectData: self.dataProvider.getRow('object_data', searchObject),
				uuid: event.data.uuid,
			});
			break;
		case 'getTrainingObject':
			self.postMessage({ trainingObject: self.initialTrainingObject });
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
					const objectData = self.dataProvider.getDataLines('object_data');
					const filteredObjectData = objectData.filter((row) => row[0] === ImageNumber);
					const filteredCellPairs = filteredObjectData.map((row) => ({ ImageNumber, ObjectNumber: row[1] }));
					return filteredCellPairs;
				}
				case 'cellPairData': {
					const cellPair = {
						ImageNumber: parseInt(event.data.getArgs.cellPair.ImageNumber),
						ObjectNumber: parseInt(event.data.getArgs.cellPair.ObjectNumber),
					};
					const cellData = self.dataProvider.getCellData(cellPair);

					return cellData;
				}
				case 'cellSize': {
					const cellSize = self.dataProvider.getProperty('image_tile_size');
					return cellSize;
				}
			}
		case 'test':
			return 'data test';
	}
};

const handleClassifierWorkerMessage = function (event) {
	switch (event.data.action) {
		case 'getObjectData':
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
	const { uuid } = event.data;
	self.canvasWorkerPort.postMessage({ postResult, uuid });
};

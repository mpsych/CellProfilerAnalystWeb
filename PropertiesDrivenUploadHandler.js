self.importScripts('https://cdn.jsdelivr.net/npm/papaparse@5.3.0/papaparse.min.js');
self.importScripts('PropertiesDrivenDataProvider.js');
self.importScripts('TrainingTable.js');
self.importScripts('ConfigurablePapaParser.js');

const COMMENT_MARKER = '#';
const PROPERTY_DELIM = '=';
const WILDCARD_SYM = '.*';

class PropertiesDrivenUploadHandler {
	constructor(fileHandler, propertyDict) {
		this.fileHandler = fileHandler;
		this.propertyDict = propertyDict;
	}

	async getDataProvider() {
		const columnNamesDict = await PropertiesDrivenUploadHandler.getColumnNamesDict(
			this.fileHandler,
			this.propertyDict
		);
		const objectArray = await PropertiesDrivenUploadHandler.getObjectArray(this.fileHandler, this.propertyDict);
		const imageArray = await PropertiesDrivenUploadHandler.getImageArray(this.fileHandler, this.propertyDict);

		const dataProvider = new PropertiesDrivenDataProvider({
			object_data: objectArray,
			image_data: imageArray,
			object_columns: columnNamesDict['objectTableColumns'],
			image_columns: columnNamesDict['imageTableColumns'],
			propertyDict: this.propertyDict,
		});

		return dataProvider;
	}

	async getTrainingTable() {
		const trainingSetLines = await PropertiesDrivenUploadHandler.getTrainingsetLines(
			this.fileHandler,
			this.propertyDict
		);
		const trainingSetColumnNames = 'label imagenum objectnum x y'.split(' ');
		const trainingTable = new TrainingTable(trainingSetLines, trainingSetColumnNames);
		return trainingTable;
	}

	async getInitialTrainingObject(dataProvider) {
		const totalFeatures = dataProvider.getObjectColumnLines();
		const trainingTable = await this.getTrainingTable();
		const trainingDataTable = trainingTable.getDataColumnsPaired();
		const initialTrainingData = trainingDataTable.map((row_object) => {
			const ObjectNumber = row_object['objectnum'];
			const ImageNumber = row_object['imagenum'];
			return dataProvider.getRowArray('object_data', { ObjectNumber, ImageNumber });
		});

		const trainingLabels = trainingTable.getTrainingLabels();
		console.log(this.propertyDict);
		console.log(totalFeatures);
		const featureIsUsed = (feature) =>
			this.propertyDict['classifier_ignore_columns'].reduce((prefix, acc) => acc && !feature.includes(prefix)) &&
			feature !== 'ObjectNumber' &&
			feature !== 'ImageNumber';
		const tempIndices = totalFeatures.map((feature, idx) => (featureIsUsed(feature) ? idx : -1));
		console.log(featureIsUsed(this.propertyDict['cell_x_loc']));
		const featureIndicesToUse = tempIndices.filter((index) => !(index === -1));

		console.log(featureIndicesToUse);
		const initialTrainingObject = {
			classifierType: 'LogisticRegression',
			trainingData: initialTrainingData,
			trainingLabels,
			featureIndicesToUse,
		};
		console.log(initialTrainingObject);
		return initialTrainingObject;
	}

	static async create(fileHandler) {
		console.log('start creation of dp and tt');
		const propertyDict = await this.parsePropertiesFile(fileHandler);
		return new PropertiesDrivenUploadHandler(fileHandler, propertyDict);
	}

	static async parsePropertiesFile(fileHandler) {
		const file = fileHandler.findFileWithExtension('.properties');
		const textContent = await file.text();
		const splitLines = textContent.split('\n');

		const propertyDict = {};

		for (let lineString of splitLines) {
			if (lineString.length === 0) {
				continue;
			}
			if (lineString.startsWith(COMMENT_MARKER)) {
				continue;
			}

			const delimSplit = lineString.split(PROPERTY_DELIM);
			const key = delimSplit[0].trim();
			let value = delimSplit[1].trim();
			if (
				key === 'image_channel_paths' ||
				key === 'image_channel_files' ||
				key === 'image_channel_names' ||
				key === 'image_channel_colors' ||
				key === 'classifier_ignore_columns'
			) {
				value = value
					.trim(',')
					.split(',')
					.map((s) => s.trim().replace(WILDCARD_SYM, ''))
					.filter((s) => s !== '');
			}

			propertyDict[key] = value;
		}
		return propertyDict;
	}

	static async getColumnNamesDict(fileHandler, propertyDict) {
		const sqlFile = fileHandler.findFile(propertyDict['db_sql_file']);
		const sqlTextContent = await sqlFile.text();
		var columnsLines = sqlTextContent.split('\n').map((e) => e.trim());

		const objectTableColumns = this.sliceArrayByValue(
			columnsLines,
			'CREATE TABLE per_object (',
			'PRIMARY KEY  (ImageNumber,ObjectNumber)'
		)
			.map((name) => name.split(' ')[0])
			.slice(1);
		const imageTableColumns = this.sliceArrayByValue(
			columnsLines,
			'CREATE TABLE per_image (',
			'PRIMARY KEY  (ImageNumber)'
		)
			.map((name) => name.split(' ')[0])
			.slice(1);
		// data_columns.push('label imagenum objectnum x y'.split(' '));
		return { objectTableColumns, imageTableColumns };
	}

	static sliceArrayByValue = function (array, value1, value2) {
		const index1 = array.indexOf(value1);
		const index2 = array.indexOf(value2);

		if (value1 === -1 || value2 === -1) {
			console.error('Values not found to slice');
			return null;
		}

		return array.slice(index1, index2);
	};

	static async getObjectArray(fileHandler, propertyDict) {
		const objectCsvParser = new ConfigurablePapaParser({
			skipEmptyLines: true,
			fastMode: true,
		});
		const objectFile = fileHandler.findFile(`${propertyDict['object_table']}.csv`);
		const objectArray = await objectCsvParser.dataFromCSVFile(objectFile);
		// many lines means need for loop optimization, in-place as .map() is slow
		for (let i = 0; i < objectArray.length; i++) {
			for (let j = 0; j < objectArray[i].length; j++) {
				objectArray[i][j] = parseFloat(objectArray[i][j]);
			}
		}

		return objectArray;
	}

	static async getImageArray(fileHandler, propertyDict) {
		const imageCsvParser = new ConfigurablePapaParser({
			skipEmptyLines: true,
			dynamicTyping: true,
		});
		const imageFile = fileHandler.findFile(`${propertyDict['image_table']}.csv`);
		const imageArray = await imageCsvParser.dataFromCSVFile(imageFile);
		return imageArray;
	}

	static async getTrainingsetLines(fileHandler, propertyDict) {
		const trainingsetFile = fileHandler.findFile(`${propertyDict['training_set']}`);
		const trainingsetTextContent = await trainingsetFile.text();
		const trainingSetLinesSplit = trainingsetTextContent
			.split('\n')
			.filter((lineString) => !lineString.startsWith(COMMENT_MARKER))
			.filter((lineString) => !lineString.startsWith('label'))
			.filter((lineString) => lineString.length > 0)
			.map((lineString) => lineString.split(' '));
		return trainingSetLinesSplit;
	}
}

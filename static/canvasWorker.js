self.importScripts('ImageProvider2.js');
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/validate.js/0.13.1/validate.min.js');
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuid.min.js');
self.onmessage = async (event) => {
	self.uuidv4Maker = uuid.v4;

	switch (event.data.action) {
		case 'connectToDataWorker':
			self.dataWorkerPort = event.ports[0];
			self.dataWorkerPort.onmessage = (event) => {};
			break;
		case 'connectToClassifierWorker':
			self.classifierWorkerPort = event.ports[0];
			self.classifierWorkerPort.onmessage = self.handleClassifierWorkerMessage;
			break;
		case 'test':
			const exampleCanvas = new OffscreenCanvas(40, 40);
			const example_ctx = exampleCanvas.getContext('2d');
			example_ctx.beginPath();
			example_ctx.strokeStyle = 'red';
			example_ctx.lineWidth = '4';
			example_ctx.rect(5, 5, 30, 30);
			example_ctx.stroke();
			exampleCanvas.convertToBlob().then(function (blob) {
				console.log(blob);
			});
			self.postMessage({ uuid: event.data.uuid, blob: event.data.fileListObject[6] });
			break;
		case 'get':
			const result = await self.fulfillGet(event.data.getArgs, event.data.getType);
			self.postMessage({ getResult: result, uuid: event.data.uuid });
			break;
	}
};
self.fulfillGet = async function (getArgs, getType) {
	switch (getType) {
		case 'blobUrlsFromCellPairs': {
			const { cellPairs } = getArgs;
			const blobUrls = await self.getUrlsByCellPairs(cellPairs);
			return blobUrls;
		}
		case 'blobUrlBigPictureFromCellPair': {
			const { cellPair } = getArgs;
			const blobUrl = await self.getBigPictureURL(cellPair);
			return blobUrl;
		}
		case 'blobUrlBigPictureByImageNumber': {
			const { imageNumber } = getArgs;
			const blobUrl = await self.getBigPictureURLByImage(imageNumber);
			return blobUrl;
		}
		case 'imageBitmapsUnscaledByCellPairs': {
			const { cellPairs } = getArgs;
			if (!cellPairs) throw new Error('cellPairs not found in:', getArgs);
			const imageBitmaps = await self.getImageBitmapsByCellPairs(cellPairs);
			return imageBitmaps;
		}
		default: {
			throw new Error('Invalid get Action in canvasWorker');
		}
	}
};

self.workerPortActionPromise = function (port, action, data) {
	const UUID = self.uuidv4Maker();

	return new Promise((resolve) => {
		let eventHandler = (event) => {
			if (event.data.uuid === UUID) {
				port.removeEventListener('message', eventHandler);
				resolve(event);
			}
		};
		port.addEventListener('message', eventHandler);

		port.postMessage({ action, ...data, uuid: UUID });
	});
};

self.getBigPictureURL = async function (cellPair) {
	var cur_ImageNum = cellPair.ImageNumber;
	var image_info = [];

	var key = cur_ImageNum.toString();
	image_info = await this.getImagesByNumber(cur_ImageNum);
	let event = await self.workerPortActionPromise(self.dataWorkerPort, 'get', {
		getType: 'coordsFromCellPair',
		getArgs: { cellPair },
	});
	const coords = event.data.postResult;
	event = await self.workerPortActionPromise(self.dataWorkerPort, 'get', {
		getType: 'cellSize',
		getArgs: {},
	});
	const cellSize = event.data.postResult;

	var ip = new ImageProvider2(image_info, coords, { x: cellSize, y: cellSize });
	var url = await ip.getBigPictureDataURLPromise();
	return url;
};

self.getBigPictureURLByImage = async function (imageNumber) {
	var image_info = [];

	image_info = await this.getImagesByNumber(imageNumber);
	var ip = new ImageProvider2(image_info);
	var url = await ip.getBigPictureDataURLOnlyImagePromise();
	return url;
};

/*
    @param {Array<{ImageNumber: int, ObjectNumber: int}>} cellPairs
        The array of cell pairs that we want to return as urls
    @return {Array<DOMString>} urls
        The array of urls corresponding to the cellPairs
*/
self.getUrlsByCellPairs = async function (cellPairs) {
	var urls = [];
	for (var i = 0; i < cellPairs.length; i++) {
		var cur_ImageNum = cellPairs[i].ImageNumber;
		var image_info = [];

		image_info = await self.getImagesByNumber(cur_ImageNum);

		let event = await self.workerPortActionPromise(self.dataWorkerPort, 'get', {
			getType: 'coordsFromCellPair',
			getArgs: { cellPair: cellPairs[i] },
		});
		const coords = event.data.postResult;

		event = await self.workerPortActionPromise(self.dataWorkerPort, 'get', {
			getType: 'cellSize',
			getArgs: {},
		});
		const cellSize = event.data.postResult;

		var ip = new ImageProvider2(image_info, coords, { x: cellSize, y: cellSize });
		var url = await ip.getDataURLPromise();
		urls.push(url);
	}
	return urls;
};

self.getImageBitmapsByCellPairs = async function (cellPairs) {
	var imageBitmaps = [];
	for (let i = 0; i < cellPairs.length; i++) {
		let cur_ImageNum = cellPairs[i].ImageNumber;
		let image_info = [];
		image_info = await self.getImagesByNumber(cur_ImageNum);
		let event = await self.workerPortActionPromise(self.dataWorkerPort, 'get', {
			getType: 'coordsFromCellPair',
			getArgs: { cellPair: cellPairs[i] },
		});
		let coords = event.data.postResult;

		event = await self.workerPortActionPromise(self.dataWorkerPort, 'get', {
			getType: 'cellSize',
			getArgs: {},
		});
		const cellSize = event.data.postResult;

		var ip = new ImageProvider2(image_info, coords, { x: cellSize, y: cellSize });

		imageBitmaps.push(ip.getImageDataNoScaling());
	}
	return imageBitmaps;
};
// self.getImgUrl = async function (object) {
// 	//takes {ImageNumber:...}
// 	var images = this.getImagesfromFile(object);
// 	var ip = new ImageProvider2(images);
// 	return ip.getDataUrl();
// };
/*
    @param {number} imageNumber
        The number corresponding to the image file
    @return {Array<{image: Image, color: string}>}
*/
self.getImagesByNumber = async function (imageNumber) {
	const event = await self.workerPortActionPromise(self.dataWorkerPort, 'get', {
		getType: 'pathsObjectFromImageNumber',
		getArgs: { imageNumber },
	});
	var images_paths_object = event.data.postResult;

	var images = await Promise.all(
		images_paths_object.map(async (image_path) => {
			const event = await self.workerPortActionPromise(self.dataWorkerPort, 'get', {
				getType: 'fileFromFileName',
				getArgs: { fileName: image_path.filename },
			});

			const file = event.data.postResult;
			const image = await createImageBitmap(file);

			return image;
		})
	);
	for (var i = 0; i < images.length; i++) {
		delete images_paths_object[i].filename;
		images_paths_object[i].image = images[i];
	}
	return images_paths_object;
};

/*
    @param {DOMString} newSrc
    @return {Promise<Image>}
*/
self.makeImagePromise = function (newSrc) {
	return new Promise((resolve) => {
		var img = new Image();
		img.onload(() => {
			resolve(img);
		});
		img.src = newSrc;
	});
};

self.handleClassifierWorkerMessage = async function (event) {
	switch (event.data.action) {
		case 'get':
			const result = await self.fulfillGet(event.data.getArgs, event.data.getType);
			if (event.data.getArgs.transferable) {
				self.classifierWorkerPort.postMessage({ uuid: event.data.uuid, getResult: result }, result);
			} else {
				self.postMessage({ getResult: result, uuid: event.data.uuid });
			}

			break;
		default:
			throw new Error("Can't handle invalid message action from classifier, from canvasWorker");
	}
};

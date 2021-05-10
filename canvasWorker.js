
self.importScripts('ImageProvider2.js')

self.importScripts("https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuid.min.js")
self.onmessage = async (event) => {

self.uuidv4Maker = uuid.v4
    
    switch (event.data.action) {
      case "connectToDataWorker":
        self.dataWorkerPort = event.ports[0]
        // self.dataWorkerPort.onmessage = (event) => console.log(event)
        self.dataWorkerPort.onmessage = (event) => {}
        break;
      case "test":
        const exampleCanvas = new OffscreenCanvas(40, 40)
        const example_ctx = exampleCanvas.getContext('2d')
        example_ctx.beginPath()
        example_ctx.strokeStyle = "red";
        example_ctx.lineWidth = "4";
        example_ctx.rect(5,5, 30, 30)
        example_ctx.stroke();
        exampleCanvas.convertToBlob().then(function(blob) {
            console.log(blob);
            // self.postMessage({uuid: event.data.uuid, blob})
          });
        console.log(event.data.fileListObject[6])
        self.postMessage({uuid: event.data.uuid, blob:event.data.fileListObject[6]})
        break;
      case "get":
        switch(event.data.getType) {
          case "blobUrlsFromCellPairs":
            // console.log(event)
            const {cellPairs} = event.data.getArgs
            const blobUrls = await self.getObjsToURLs(cellPairs)
            // console.log(blobUrls)
            self.postMessage({blobUrls, uuid: event.data.uuid})
            
            break;
        }
        break;
    }
}

self.workerPortActionPromise = function(port, action, data) {
  // console.log("workerPortActionPromise enter")
  // console.log(port, action, data)
  const UUID = self.uuidv4Maker()

  return new Promise (resolve => {
    let eventHandler = (event) => {
      if (event.data.uuid === UUID) {
        port.removeEventListener('message', eventHandler);
        resolve(event)
      }
    }
    port.addEventListener('message', eventHandler)
    
    port.postMessage({action, ...data, uuid:UUID})
  })
  
}


/*
    @param {Array<{ImageNumber: int, ObjectNumber: int}>} cellPairs
        The array of cell pairs that we want to return as urls
    @return {Array<DOMString>} urls
        The array of urls corresponding to the cellPairs
*/
self.getObjsToURLs = async function(cellPairs) { 
  // console.log("getObjsToURLs")
  var urls = [];
  for (var i = 0; i < cellPairs.length; i++) {
      var cur_ImageNum = cellPairs[i].ImageNumber;
      var image_info = [];

      var key = cur_ImageNum.toString()
      image_info = await this.getImagesByNumber(cur_ImageNum)
      // console.log(image_info)
      // this.images_seen[key] = image_info

        // var coords = this.data_provider.getCoordsforCellDisplay(cellPairs[i])
        const event = await self.workerPortActionPromise(self.dataWorkerPort, 'get', {
          getType: "coordsFromCellPair", getArgs: {cellPair: cellPairs[i]}
        })
        var coords = event.data.postResult
        // console.log(coords)
        var ip = new ImageProvider2(image_info, coords)
        var url = await ip.getDataURLPromise()
        urls.push(url)     
  }
  return urls;
}
self.getImgUrl = async function(object) { //takes {ImageNumber:...}
  var images = this.getImagesfromFile(object);
  var ip = new ImageProvider2(images)
  return ip.getDataUrl()
}
/*
    @param {number} imageNumber
        The number corresponding to the image file
    @return {Array<{image: Image, color: string}>}
*/
self.getImagesByNumber = async function(imageNumber) {
  // console.log("getImagesByNumber enter")
  // var images_paths_object = this.data_provider.returnAllImgFileNames(imageNumber)
  const event = await self.workerPortActionPromise(self.dataWorkerPort, 'get', {
    getType: "pathsObjectFromImageNumber", getArgs: {imageNumber}
  })
  var images_paths_object = event.data.postResult

  // console.log(images_paths_object)
  var images = await Promise.all(images_paths_object.map(async image_path => {
        // console.log(image_path)
        const event = await self.workerPortActionPromise(self.dataWorkerPort, 'get', {
        getType: "fileFromFileName", getArgs: {fileName:image_path.filename}
        })
        
        const file = event.data.postResult
        const image = await createImageBitmap(file);
        
        return image
          // return this.makeImagePromise(URL.createObjectURL(file))
        
      // var file = this.file_handler.findFile(image_path.filename)
      
      }))
  // console.log('got images: ', images)
  for (var i = 0; i < images.length; i++) {
      delete images_paths_object[i].filename
      images_paths_object[i].image = images[i]
  }
  // console.log(images_paths_object)
  // console.log("getImagesByNumber exit")
  return images_paths_object
}
      
/*
    @param {DOMString} newSrc
    @return {Promise<Image>}
*/
self.makeImagePromise = function(newSrc) {
  return new Promise(resolve => {
      var img = new Image()
      img.onload(()=>{
          resolve(img)
      })
      img.src = newSrc
  })
}

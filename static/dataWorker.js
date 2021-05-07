//import papaparse
self.importScripts("https://cdn.jsdelivr.net/npm/papaparse@5.3.0/papaparse.min.js")
self.importScripts("UploadHandler.js")

self.initialized = false




self.onmessage = async (event) => {

    switch(event.data.action) {
        case "init":
            // console.log("parsing object data")
            // const fileListObject = event.data.fileListObject
            // Papa.parse(fileListObject[5], {
            //     dynamicTyping: true,
            //     fastMode: true,
            //     skipEmptyLines: true,
            //     complete: (results) =>{
            //         self.objectData = results.data; 
            //         self.initialized = true
            //         constructLookUpTables()
            //         self.postMessage({action: "init"})
            //         self.postMessage({action: "test", object_mapped : self.object_mapped}); 
            //         console.log(self.object_mapped)
            //         console.log(self.imgs_size)
            //     }
            // })
            const uploadHandler = new UploadHandler(event.data.fileListObject)
            const uploadReturnObject = await uploadHandler.getDataHandlerandStartingTrainingSet();
            const dataProvider = uploadReturnObject.data_provider
            console.log(dataProvider)
            break;
        case "connectToClassifierWorker":
            self.classifierWorkerPort = event.ports[0]
            self.classifierWorkerPort.onmessage = handleClassifierWorkerMessage
            break;
        case "testSendToClassifierWorker":
            self.classifierWorkerPort.postMessage({test: "test"})
            break;
        case "printObjectDataRow":
            console.log(self.objectData[event.data.index])
            break;
        case "trainAndPredict":
            self.postMessage({action: "trainAndPredict", objectData:self.objectData})
            break;
        case "sendObjectData": 
            console.log("entry to dataworker, sendObjectData")
            self.postMessage({action: "sendObjectData", objectData:self.objectData})
            break;
        default:
            console.log("unhandled event: " + event.data)
    }

}

const handleClassifierWorkerMessage = function(event) {
    console.log("data worker received classifier worker data")
    console.log(event.data)

    switch(event.data.action) {
        case "sendObjectData":
            console.log("got from classifierworker so return there with subaction")
            self.classifierWorkerPort.postMessage({action: event.data.subAction, objectData:self.objectData})
    }
}

const constructLookUpTables = function() {
    self.object_column = {}
    self.object_mapped = {}
    self.imgs_size = {}
    var obj_index = 1
    var img_index = 0
    console.log(self.objectData[0][1])
    for (var i = 0, size = 0; i < self.objectData.length; i++, size++) {
       if (self.objectData[i] === null) { console.log(self.objectData[i][img_index])}
        var img = self.objectData[i][img_index].toString() 
        var obj = self.objectData[i][obj_index].toString() 
        var index = img.concat(',',obj)
        self.object_mapped[index] = i
        if (!self.imgs_size.hasOwnProperty(img)) {
            self.imgs_size[img] = 0; 
        }
        self.imgs_size[img]++
    }
 }

//import papaparse
self.importScripts("https://cdn.jsdelivr.net/npm/papaparse@5.3.0/papaparse.min.js")
self.initialized = false
self.onmessage = async (event) => {

    switch(event.data.action) {
        case "init":
            break;
        case "connectToClassifierWorker":
            self.classifierWorkerPort = event.ports[0]
            self.classifierWorkerPort.onmessage = handleClassifierWorkerMessage
            break;
        case "testSendToClassifierWorker":
            self.classifierWorkerPort.postMessage({test: "test"})
            break;
        default:
            console.log("unhandled event: " + event.data)
    }

}

const handleClassifierWorkerMessage = function(event) {
    console.log("data worker received classifier worker data")
    console.log(event.data)
}

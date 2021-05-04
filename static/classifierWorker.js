// import tensorflow
self.importScripts("https://cdnjs.cloudflare.com/ajax/libs/tensorflow/3.5.0/tf.min.js")
self.onmessage = async (event) => {

    switch(event.data.action) {
        case "init":
            break;
        case "connectToDataWorker":
            self.dataWorkerPort = event.ports[0]
            self.dataWorkerPort.onmessage = handleDataWorkerMessage
            break;
        case "testSendToDataWorker":
            self.dataWorkerPort.postMessage({test: "test"})
            break;
        default:
            console.log("unhandled event: " + event.data)
    }

}

const handleDataWorkerMessage = function(event) {
    console.log("classifier worker received data worker data")
    console.log(event.data)
}

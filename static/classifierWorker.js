// import tensorflow
self.importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs")
self.importScripts("classifierWorkerUtils.js")
// self.importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-vis")
console.log(typeof tf !== "undefined"? "TensorFlow Loaded In WebWorker" : "TensorFlow Failed To Load In WebWorker")
// console.log(typeof tfvis !== "undefined"? "TensorFlow-Visor Loaded In WebWorker" : "TensorFlow-Visor Failed To Load In WebWorker")
self.importScripts("https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuid.min.js")
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
        case "printObjectDataRow":
            self.dataWorkerPort.postMessage({action: "sendObjectData", subAction: "printObjectDataRow"})
            break;

        case "trainAndPredict":
            console.log("initial entry train and predict classifierworker send to dataworker for object data")

            self.dataWorkerActionPromise("getObjectData", async (event) => {
                console.log("start training after getting back from dataworker")
                const featureIndices = [30,31]
                const batchSize = 32
                const objectDataSubset = event.data.objectData.slice(0, 100)
                const labels = new Array(objectDataSubset.length).fill(1)
                const model = self.createLogisticRegressionModel(featureIndices.length)
                const numberEpochs = 20
                const tf_dataset = self.createDatasetFromDataArrays(objectDataSubset, labels, featureIndices, batchSize)
                // mutates model to be trained
                await self.basicTrainPromise(model, tf_dataset, numberEpochs)

                console.log("finished training, start predicting")
                const testDataTensor =  self.createTestset(event.data.objectData, featureIndices)
                console.log(self.predict(model, testDataTensor))
                self.classifier = model
            })
            break;
            
        default:
            console.log("unhandled event: ", event.data)
    }

}

self.dataWorkerActionPromise = function(action, callback) {
    const { v4: uuidv4 } = uuid
    const UUID = uuidv4()
    console.log("DataWorkerActionPromise: " + UUID, "started call: " + action)
    

    return new Promise(resolve => {
        self.dataWorkerPort.addEventListener("message", (event)=>{
            if (event.data.uuid === UUID) {
                resolve(callback(event))
            }
            else {
                console.log("DataWorkerActionPromise: " + UUID, "Skipped non-uuid call")
            }

        }, {once: true})
        self.dataWorkerPort.postMessage({action: action, uuid:UUID })

    })

}

self.handleDataWorkerMessage = function(event) {
    console.log("classifier worker received data worker data normal way")
    console.log(event.data)
    switch(event.data.action) {
        case "printObjectDataRow":
            console.log(event.data.objectData[0])
            
            break;
        case "trainAndPredict":
            console.log("start training after getting back from dataworker")
            const featureIndices = [30,31]
            const batchSize = 32
            const objectDataSubset = event.data.objectData.slice(0, 100)
            const labels = new Array(objectDataSubset.length).fill(1)
            const model = self.createLogisticRegressionModel(featureIndices.length)
            const numberEpochs = 20
            const tf_dataset = self.createDatasetFromDataArrays(objectDataSubset, labels, featureIndices, batchSize)
            // mutates model to be trained
            self.basicTrainPromise(model, tf_dataset, numberEpochs)
            .then(()=>{
                console.log("finished training, start predicting")
                const testDataTensor =  self.createTestset(event.data.objectData, featureIndices)
                console.log(self.predict(model, testDataTensor))
            })
            break;
        default:
            break;

    }
    // console.log(event.data)
}

/*
    @param {Array<Array<number>>} dataArrays 
        The 2D Array of data with feature columns and row entries to draw data from to predict on
    @param {Array<int>} featureIndices 
        The Array of indices from dataArrays to predict on
    @return {Tensor<Tensor<number>>} normed_X_tf 
        The 2D Tensor of numbers to predict on
*/
self.createTestset = function(dataArrays, featureIndices){
    const X = dataArrays.map(dataRowArray =>
        featureIndices.map((index)=>dataRowArray[index])
    )
    const normed_X = self.norm2DArray(X)
    return tf.tensor(normed_X)
}


/*
    @param {int} featureCount The number of input features to the model
    @return {tf.sequential} model The TensorFlow LogisticRegression model
*/
self.createLogisticRegressionModel = function(featureCount)  {
    const model = tf.sequential();

    model.add(
    tf.layers.dense({
        units: 2,
        activation: "softmax",
        inputShape: [featureCount],
        kernelRegularizer: tf.regularizers.l1({l1: 0.1})
    }));

    const optimizer = tf.train.adam(0.001);
    model.compile({
    optimizer: optimizer,
    loss: "binaryCrossentropy",
    metrics: ["accuracy"]
    });

    return model;
}

/*
    @param  {Array<0|1>} labels A list of 0s and 1s corresponding to a 
                                classification of negative and positive respectively
    @return {Tensor<Tensor<number>>} oneHotForm The Tensor One-Hot form of the labels
*/
self.labelsToOneHot = function(labels) {
    const oneHotForm = labels.map(label => {
        const outcome = label === undefined ? 0 : label;
        return Array.from(tf.oneHot(outcome, 2).dataSync());
    })
    return oneHotForm
}

/*
    @param  {Tensor<number>} X The training inputs for the dataset
    @param  {Tensor<Tensor<number>>} Y The training desired outputs for the dataset
    @return {tf.data.Dataset} tf_dataset The dataset object TensorFlow uses for training
*/
self.createTensorflowDataset = function(X, Y) {
    const tf_dataset = tf.data
    .zip({ xs: tf.data.array(X), ys: tf.data.array(Y) })
    .shuffle(X.length, Date.now()%100000);
    return tf_dataset
}


/*
    @param {tf.sequential} model The model to do prediction with
    @param {Tensor<Tensor<number>>} testDataTensor The 2D Tensor of data with feature columns and entry rows to predict labels for
    @return {Array<(0|1)>} predictions The array of 0s and 1s corresponding to the model's predictions on the testDataArray 
*/
self.predict = function(model, testDataTensor) {
    const tf_predictions = model.predict(testDataTensor).argMax(-1);
    return tf_predictions.arraySync()
}





self.basicTrainPromise = function(model, training_dataset, number_epochs ) {
        

    
    const trainLogs = [];
    return new Promise(
        (resolve, reject) => {
            model.fitDataset(training_dataset, {
                epochs: number_epochs,
                callbacks: {
                    onEpochEnd: (epoch, logs) => {
                            console.log(logs)
                            trainLogs.push(logs);
                            console.log("epoch end:", epoch)
                            self.postMessage({action: "updateTrainingAccuracyCanvas",trainLogs, ticks:["acc"] }) 
                            self.postMessage({action: "updateTrainingLossCanvas",trainLogs, ticks:["loss"] }) 
                        },
                    onTrainEnd: ()=>resolve(model)
                } 
            });
        }
    )
    
    
}

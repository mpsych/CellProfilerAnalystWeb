import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import { assert } from "chai";
import _ from "lodash";

class Classifier {
    constructor(ClassifierOptions) {
        this.classifierType = ClassifierOptions.classifierType;
        this.numberFeatures = ClassifierOptions.featureNames.length;
        this.featureNames = ClassifierOptions.featureNames;
        this.trainingData = ClassifierOptions.trainingData;
        this.trainingLabels = ClassifierOptions.trainingLabels;
        this.model = Classifier.createLogisticRegressionModel(this.numberFeatures);
        this.test_feature_preconditions();
    }

    test_feature_preconditions() {
        const first_row_features = _.keys(this.trainingData[0])

        // make sure first row features includes all feature names

        const superset = first_row_features
        const subset = this.featureNames
        const includes_all_feature_names = _.difference(subset, superset).length === 0

        if (!includes_all_feature_names) {
            throw new Error("Constructor Error thrown that features names doesn't match training data row 0")
        }

        if (this.trainingLabels.length != this.trainingData.length) {
            throw new Error("Classifier trainingData size doesn't match labels size")
        }
    }

    trainPromise() {
        return new Promise(async (resolve, reject) => {

            const tf_batched_dataset = Classifier.createBasicDataset(
                this.trainingData,
                this.trainingLabels,
                this.featureNames,
                16
            );
            const number_epochs = 20;
            this.model = await Classifier.basicTrainPromise(
                this.model,
                tf_batched_dataset,
                number_epochs,       
            )
            
            

            resolve(null)
        });
    }

    predictPromise(test_data) {
        const tf_dataset = Classifier.createBasicTestset(test_data, this.featureNames)
        const tf_predictions = this.model.predict(tf_dataset).argMax(-1);
        return tf_predictions.array()
    }

    static hasMultiple = (feature_names, object) => {
        return _.every(feature_names, _.partial(_.has, object));
    }

    static norm2DArray = (array) => {

        var means_array = new Array(array[0].length).fill(0)
        for (var j = 0; j < array[0].length; j++) {
            var sum = new Array(array[0].length).fill(0)
            for (var i = 0; i < array.length; i++) {
                sum[j] += array[i][j]
            }
            means_array[j] = sum[j]/array[0].length
        }


        var stddevs_array = new Array(array[0].length).fill(0)

        for (var j = 0; j < array[0].length; j++) {
            var sum_squares = new Array(array[0].length).fill(0)
            for (var i = 0; i <array.length; i++) {
                sum_squares[j] += Math.pow((array[i][j] - means_array[j]),2)
            }
            stddevs_array[j] = Math.sqrt(sum_squares[j])
        }


        const normed_array = array.map(data_row => 
            {
                return data_row.map( (value, idx) => (value - means_array[idx])/stddevs_array[idx])
            }
        )

        return normed_array;

    }

    static createBasicDataset = (data, labels, feature_names, batchSize) => {
        console.assert(Object.values(data[0]).reduce((accum, currVal)=>accum&&(typeof currVal === "number")), "First row object is numbers")
        console.assert(Classifier.hasMultiple(feature_names, data[0]), "First row object has all the feature columns fields");
        console.assert(data.length===labels.length, "data and labels match in length")

        // turn data into a 2d array, and make all undefined data_row fields 0
        const X = data.map(data_row =>
            feature_names.map(feature_name => {
                const feature_value = data_row[feature_name];
                return feature_value === undefined ? 0 : feature_value;
            })
        )

        const normed_X = Classifier.norm2DArray(X)
        

        // make undefined labels into 0s and then convert into tensorflow format for categorical ML
        const Y = labels.map(label => {
            const outcome = label === undefined ? 0 : label;
            return Array.from(tf.oneHot(outcome, 2).dataSync());
        })

        // turn the dataset into a tensorflow dataset object
        const tf_dataset = tf.data
        .zip({ xs: tf.data.array(normed_X), ys: tf.data.array(Y) })
        .shuffle(data.length, Date.now()%100000);

        return tf_dataset.batch(batchSize);

    }

    static createBasicTestset = (data, feature_names, labels=null) => {
        const X = data.map(data_row =>
            feature_names.map(feature_name => {
                const feature_value = data_row[feature_name];
                return feature_value === undefined ? 0 : feature_value;
            })
        )

        const normed_X = Classifier.norm2DArray(X)

        if(!labels) {
            return tf.tensor(normed_X)
        }

        const Y = labels.map(label => {
            const outcome = label === undefined ? 0 : label;
            return Array.from(tf.oneHot(outcome, 2).dataSync());
        })

        return [tf.tensor(normed_X), tf.tensor(Y)]
        
    }

    static createLogisticRegressionModel = (feature_count) => {
        const model = tf.sequential();

        model.add(
        tf.layers.dense({
            units: 2,
            activation: "softmax",
            inputShape: [feature_count],
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

    static basicTrainPromise = async (model, training_dataset, number_epochs, render_containers=null ) => {
        

        
        if (render_containers !== null) {
            var lossContainer = render_containers.lossContainer;
            var accContainer = render_containers.accContainer;
        }
        
        const trainLogs = [];
        return new Promise(
            (resolve, reject) => {
                model.fitDataset(training_dataset, {
                    epochs: number_epochs,
                    callbacks: {
                        onEpochEnd: render_containers? async (epoch, logs) => {
                            trainLogs.push(logs);
                            console.log("epoch end:", epoch)
                            if (render_containers){
                                tfvis.show.history(lossContainer, trainLogs, ["loss"]);
                                tfvis.show.history(accContainer, trainLogs, ["acc"]);
                            }
                        
                        } : undefined,
                        onTrainEnd: ()=>resolve(model)
                    } 
                });
            }
        )
        
        
    }
}

export {Classifier}
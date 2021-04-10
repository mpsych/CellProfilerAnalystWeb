
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import _ from "lodash";



// expects data to be an array of objects where each object includes the fields of the elements of columns
export default class GeneralClassifier {
    
    static hasMultiple = (feature_names, object) => {
        return _.every(feature_names, _.partial(_.has, object));
    }
    // static oneHot_binary = outcome => Array.from(tf.oneHot(outcome, 2).dataSync());

    static createBasicDataset = (data, labels, feature_names, batchSize) => {
        console.assert(Object.values(data[0]).reduce((accum, currVal)=>accum&&(typeof currVal === "number")), "First row object is numbers")
        console.assert(GeneralClassifier.hasMultiple(feature_names, data[0]), "First row object has all the feature columns fields");
        console.assert(data.length===labels.length, "data and labels match in length")

        // turn data into a 2d array, and make all undefined data_row fields 0
        const X = data.map(data_row =>
            feature_names.map(feature_name => {
                const feature_value = data_row[feature_name];
                return feature_value === undefined ? 0 : feature_value;
            })
        )

        // make undefined labels into 0s and then convert into tensorflow format for categorical ML
        const Y = labels.map(label => {
            const outcome = label === undefined ? 0 : label;
            return Array.from(tf.oneHot(outcome, 2).dataSync());
        })

        // turn the dataset into a tensorflow dataset object
        const tf_dataset = tf.data
        .zip({ xs: tf.data.array(X), ys: tf.data.array(Y) })
        .shuffle(data.length, Date.now()%100000);

        return [tf_dataset.batch(batchSize), tf.tensor(X), tf.tensor(Y)];

    }

    static createBasicTestset = (data, feature_names, labels=null) => {
        const X = data.map(data_row =>
            feature_names.map(feature_name => {
                const feature_value = data_row[feature_name];
                return feature_value === undefined ? 0 : feature_value;
            })
        )

        if(!labels) {
            return tf.tensor(X)
        }

        const Y = labels.map(label => {
            const outcome = label === undefined ? 0 : label;
            return Array.from(tf.oneHot(outcome, 2).dataSync());
        })

        return [tf.tensor(X), tf.tensor(Y)]
        
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

    

    static basicTrain = async ( training_dataset, feature_count, number_epochs, render_containers=null ) => {
        console.log(feature_count)
        const model = GeneralClassifier.createLogisticRegressionModel(feature_count);

        
        if (render_containers !== null) {
            var lossContainer = render_containers.lossContainer;
            var accContainer = render_containers.accContainer;
        }
        
        const trainLogs = [];
        await model.fitDataset(training_dataset, {
            epochs: number_epochs,
            callbacks: {
                onEpochEnd: async (epoch, logs) => {
                    trainLogs.push(logs);
                    console.log("epoch end:", epoch)
                    if (render_containers){
                        tfvis.show.history(lossContainer, trainLogs, ["loss"]);
                        tfvis.show.history(accContainer, trainLogs, ["acc"]);
                    }
                
                }
            }
        });

        return model;
        

    }


}
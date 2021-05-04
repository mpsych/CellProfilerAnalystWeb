// Classifier class for both logistic regression
// and KNN regression
import * as knnClassifier from "@tensorflow-models/knn-classifier";
import *  as mobilenet from "@tensorflow-models/mobilenet";

class ClassifierKNN {
  constructor(classifierModel) {
    //Prepare KNN classifier
    if(ClassifierOptions === undefined) {
      throw new Error("Classifier Error: ClassifierOptions not passed in")
    } else if (ClassifierOptions.classifierType === undefined ||
      ClassifierOptions.trainingData === undefined ||
      ClassifierOptions.trainingLabels === undefined)  {
        throw new Error("Classifier Error: ClassifierOptions missing fields")
      } else {

        this.classifierType = ClassifierOptions.classifierType;
        this.trainingData = ClassifierOptions.trainingData;
        this.trainingLabels = ClassifierOptions.trainingLabels;
        this.model = ClassifierKNN.createKnnModel(this.numberFeatures);

      }
    }
    // Create KNN model
    static createKNNregressionModel() {
      const model = knnClassifier.create();
      return model;
    }
    // Train Promise
    trainPromise () {
      if(this.trainingData.length != this.trainingLabels) {
        thrown new Error("Label length and data length do not match");
      } else {
        return new Promise(async (resolve, reject) => {

          const tf_data = ClassifierKNN.createBasicDataset(
            this.trainingData
          );
          this.model = await Classifier.basicTrainPromise(
            this.model,
            tf_data,
            this.trainingLabels
          )
          resolve(null)
        });
      }
    }
    // Create basic dataset
    static createBasicDataset(data) {
      const net = mobilenet.load;
      var trainData = []
      for(var i=0, var len=data.length, i<len, i++) {
        trainData.push(net.infer(data[i], true));
      }
      return trainData;
    }
    // Create trainPromise
    static async basicTrainPromise(model, data, labels) {
      for(var i=0, var len=data.length, i<len, i++) {
        model.addExample(data[i], labels[i]);
      }
      return model;
    }
    // Create predict
    predict(test_data) {
      const testData = createBasicDataset(data);
      var predResults = [];
      for(var i = 0; var len=test_data.length; i < len; i++) {
        predResults.push(this.model.predictClass(testData[i]));
      }
      return predResults;
    }
    DownloadModelPromise() {
        this.model.save(`downloads://${this.classifierType}`)
    }
  }
  export(ClassifierKNN);

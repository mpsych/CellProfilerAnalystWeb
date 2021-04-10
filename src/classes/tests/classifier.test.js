import {Classifier} from "../Classifier"
var assert = require('chai').assert;
import _ from "lodash";

describe('classifier tests', function() {

  describe('constructor tests', function() {
    it('basic construct', function() {
      const classifierType = "LogisticRegression"
      const featureNames = ["f1", "f2"]
      const trainingData = [{"f1": 1, "f2": 2, "f3": 5}, {"f1": 3, "f2": 4, "f3": 6}]
      const trainingLabels = [0, 1]
      const classifierOptions = {
        classifierType, featureNames, trainingData, trainingLabels
      }
      var classifier = new Classifier(classifierOptions);
      assert.exists(classifier)
    });
    it('fail constructor on absent features', function() {
      assert.throws(()=>{
          const classifierType = "LogisticRegression"
          const featureNames = ["g1", "g2", "f3"]
          const trainingData = [{"f1": 1, "f2": 2, "f3": 5}, {"f1": 3, "f2": 4, "f3": 6}]
          const trainingLabels = [0, 1]
          const classifierOptions = {
            classifierType, featureNames, trainingData, trainingLabels
          }
          var classifier = new Classifier(classifierOptions);
          assert.exists(classifier)
        }, 
        Error, "Constructor Error thrown that features names doesn't match training data row 0")
    })
    it('fail constructor on mismatched labels to trainingdata size', function() {
      assert.throws(()=>{
          const classifierType = "LogisticRegression"
          const featureNames = ["f1", "f2", "f3"]
          const trainingData = [{"f1": 1, "f2": 2, "f3": 5}, {"f1": 3, "f2": 4, "f3": 6}]
          const trainingLabels = [0]
          const classifierOptions = {
            classifierType, featureNames, trainingData, trainingLabels
          }
          var classifier = new Classifier(classifierOptions);
          assert.exists(classifier)
        }, 
        Error, "Classifier trainingData size doesn't match labels size")
    })
  });

  describe('train tests',  function() {
    it('train returns a promise', function() {
      const classifierType = "LogisticRegression"
      const featureNames = ["f1", "f2"]
      const trainingData = [{"f1": 1, "f2": 2, "f3": 5}, {"f1": 3, "f2": 4, "f3": 6}]
      const trainingLabels = [0, 1]
      const classifierOptions = {
        classifierType, featureNames, trainingData, trainingLabels
      }
      var classifier = new Classifier(classifierOptions);

      const trainPromise =  classifier.trainPromise()
      assert.instanceOf(trainPromise,Promise)
    });
    it('awaiting train returns null', async function() {
      const classifierType = "LogisticRegression"
      const featureNames = ["f1", "f2"]
      const trainingData = [{"f1": 1, "f2": 2, "f3": 5}, {"f1": 3, "f2": 4, "f3": 6}]
      const trainingLabels = [0, 1]
      const classifierOptions = {
        classifierType, featureNames, trainingData, trainingLabels
      }
      var classifier = new Classifier(classifierOptions);

      const null_value =  await classifier.trainPromise()
      assert.isNull(null_value)
    });
  });

  describe('predict tests', function() {
    it('model outputs 0s and 1s', async function() {
      const classifierType = "LogisticRegression"
      const featureNames = ["f1", "f2"]
      const trainingData = [{"f1": 0.4, "f2": 0.2}, {"f1": 0, "f2": 0}, {"f1": 0.7, "f2": 0.2}]
      const trainingLabels = [1, 0, 1]
      const classifierOptions = {
        classifierType, featureNames, trainingData, trainingLabels
      }
      var classifier = new Classifier(classifierOptions);
      await classifier.trainPromise()
      
      const predictions = await classifier.predictPromise(trainingData)

      const isOnly0sOr1s = _.difference(predictions, [0, 1]).length === 0
      assert.isTrue(isOnly0sOr1s)

    });
  });

  describe('misc tests', function() {
    it('model norms data correctly', async function() {
      const data = [[1,4,3],[7,5,2],[7,8,9]]
      const normed = [
        [ -0.8164965809277261, -0.566138517072298, -0.31128640318234524 ],
        [ 0.4082482904638631, -0.22645540682891926, -0.49805824509175234 ],
        [ 0.4082482904638631, 0.792593923901217, 0.8093446482740974 ]
      ]
      const classifier_normed = Classifier.norm2DArray(data)
      assert.isTrue(_.isEqual(classifier_normed, normed))
    });
  });
});
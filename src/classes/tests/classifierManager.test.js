import {Classifier} from "../Classifier"
import {ClassifierManager} from "../ClassifierManager"
import {DataProvider} from "../DataProvider"
var assert = require('chai').assert;
import { LocalStorage } from "node-localstorage";
import _ from "lodash";



describe('Classifier Manager tests', function() {

    describe('constructor tests', function() {

        it('fail on pass nothing', function() {
            assert.throws(()=>{
                const m = new ClassifierManager();
                
            }, 
            
            Error, "Constructor Error on no dataprovider or no initialtrainingobject")
            
        });

        

        it('basic construct', function() {
            
            

            const object_data = [
                [1, 1, 1, 2, 5, 1, 3],
                [2, 2, 3, 4, 6, 2, 5],
                [3, 3, 2, 7, 3, 5, 4]
            ]
            const object_columns = ["ImageNumber", "ObjectNumber", "f1", "f2", "f3", "Nuclei_Location_CenterX", "Nuclei_Location_CenterY"]

            const image_data = [
                [1, "img1A.png", "img1P.png", "img1D.png"],
                [2, "img2A.png", "img2P.png", "img2D.png"],
                [3, "img3A.png", "img3P.png", "img3D.png"]
            ]
            const image_columns = ["ImageNumber", "Image_FileNames_Filename_OrigActin", "Image_FileNames_Filename_OrigpH3", "Image_FileNames_Filename_OrigDNA"]

            const uniformData = {
                object_data,
                object_columns,
                image_data,
                image_columns
            }

            const initialTrainingObject = {
                classifierType: "LogisticRegression",
                trainingData: [{"f1": 1, "f2": 2, "f3": 5}, {"f1": 3, "f2": 4, "f3": 6}],
                trainingLabels: [0, 1],
                featuresToUse: ["f1", "f2"]
            }
            const dataProvider = new DataProvider(uniformData)
            const classifierManager = new ClassifierManager(dataProvider, initialTrainingObject)

        });

    });

    describe('API: fetch random cells tests', function() {

        it('basic fetch cellPairs works and returns something valid', function() {
            const object_data = [
                [1, 1, 1, 2, 5, 1, 3],
                [2, 2, 3, 4, 6, 2, 5],
                [3, 3, 2, 7, 3, 5, 4]
            ]
            const object_columns = ["ImageNumber", "ObjectNumber", "f1", "f2", "f3", "Nuclei_Location_CenterX", "Nuclei_Location_CenterY"]

            const image_data = [
                [1, "img1A.png", "img1P.png", "img1D.png"],
                [2, "img2A.png", "img2P.png", "img2D.png"],
                [3, "img3A.png", "img3P.png", "img3D.png"]
            ]
            const image_columns = ["ImageNumber", "Image_FileNames_Filename_OrigActin", "Image_FileNames_Filename_OrigpH3", "Image_FileNames_Filename_OrigDNA"]

            const uniformData = {
                object_data,
                object_columns,
                image_data,
                image_columns
            }

            const featuresToUse = ["f1", "f2"]
            const initialTrainingObject = {
                classifierType: 'LogisticRegression',
                trainingData: [{"f1": 1, "f2": 2, "f3": 5}, {"f1": 3, "f2": 4, "f3": 6}],
                trainingLabels: [0, 1],
                featuresToUse: featuresToUse
            }
            const dataProvider = new DataProvider(uniformData)
            const classifierManager = new ClassifierManager(dataProvider, initialTrainingObject)

            const N = 2
            const classType = "random"
            const nCellPairs = classifierManager.fetchUpToNCellPairsByClass(classType, N)

            const totalPossibleCellPairs = [{"ImageNumber": 1, "ObjectNumber": 1},
                                            {"ImageNumber": 2, "ObjectNumber": 2},
                                            {"ImageNumber": 3, "ObjectNumber": 3}]

            
            // chech that each returned pair object is one of the possible pairs
            for (var i = 0; i < N; i++) {
                assert.deepInclude(totalPossibleCellPairs, nCellPairs[i])
            }
            
        });


    });



    describe('API: fetch positive/negative cells tests', function() {
        
        it('basic fetch positive/negative cellPairs works and returns something valid', async function() {
            const object_data = [
                [1, 1, 1, 2, 5, 1, 3],
                [2, 2, 3, 4, 6, 2, 5],
                [3, 3, 2, 7, 3, 5, 4]
            ]
            const object_columns = ["ImageNumber", "ObjectNumber", "f1", "f2", "f3", "Nuclei_Location_CenterX", "Nuclei_Location_CenterY"]

            const image_data = [
                [1, "img1A.png", "img1P.png", "img1D.png"],
                [2, "img2A.png", "img2P.png", "img2D.png"],
                [3, "img3A.png", "img3P.png", "img3D.png"]
            ]
            const image_columns = ["ImageNumber", "Image_FileNames_Filename_OrigActin", "Image_FileNames_Filename_OrigpH3", "Image_FileNames_Filename_OrigDNA"]

            const uniformData = {
                object_data,
                object_columns,
                image_data,
                image_columns
            }

            const featuresToUse = ["f1", "f2"]
            const initialTrainingObject = {
                classifierType: 'LogisticRegression',
                trainingData: [{"f1": 1, "f2": 2, "f3": 5}, {"f1": 3, "f2": 4, "f3": 6}],
                trainingLabels: [0, 1],
                featuresToUse: featuresToUse
            }
            const dataProvider = new DataProvider(uniformData)
            const classifierManager = new ClassifierManager(dataProvider, initialTrainingObject)
            await classifierManager.initTrainPromise()

            const classType1 = "positive"
            const N = 2
            var nCellPairs = classifierManager.fetchUpToNCellPairsByClass(classType1, N)

            const totalPossibleCellPairs = [{"ImageNumber": 1, "ObjectNumber": 1},
                                            {"ImageNumber": 2, "ObjectNumber": 2},
                                            {"ImageNumber": 3, "ObjectNumber": 3}]

            
            // chech that each returned pair object is one of the possible pairs
            // but it is allowed that it returns less than N if it hit the maxiteration value
            for (var i = 0; i < nCellPairs.length; i++) {
                assert.deepInclude(totalPossibleCellPairs, nCellPairs[i])
            }


            const classType2 = "negative"
            nCellPairs = classifierManager.fetchUpToNCellPairsByClass(classType2, N)
            
            // chech that each returned pair object is one of the possible pairs
            // but it is allowed that it returns less than N if it hit the maxiteration value
            for (var i = 0; i < nCellPairs.length; i++) {
                assert.deepInclude(totalPossibleCellPairs, nCellPairs[i])
            }

            
        });

        
        it('fetch positive/negative fail on invalid class', function() {
            const object_data = [
                [1, 1, 1, 2, 5, 1, 3],
                [2, 2, 3, 4, 6, 2, 5],
                [3, 3, 2, 7, 3, 5, 4]
            ]
            const object_columns = ["ImageNumber", "ObjectNumber", "f1", "f2", "f3", "Nuclei_Location_CenterX", "Nuclei_Location_CenterY"]

            const image_data = [
                [1, "img1A.png", "img1P.png", "img1D.png"],
                [2, "img2A.png", "img2P.png", "img2D.png"],
                [3, "img3A.png", "img3P.png", "img3D.png"]
            ]
            const image_columns = ["ImageNumber", "Image_FileNames_Filename_OrigActin", "Image_FileNames_Filename_OrigpH3", "Image_FileNames_Filename_OrigDNA"]

            const uniformData = {
                object_data,
                object_columns,
                image_data,
                image_columns
            }

            const featuresToUse = ["f1", "f2"]
            const initialTrainingObject = {
                classifierType: "LogisticRegression",
                trainingData: [{"f1": 1, "f2": 2, "f3": 5}, {"f1": 3, "f2": 4, "f3": 6}],
                trainingLabels: [0, 1],
                featuresToUse: featuresToUse
            }
            const dataProvider = new DataProvider(uniformData)
            const classifierManager = new ClassifierManager(dataProvider, initialTrainingObject)

            const classType = "zoidberg"
            const N = 2
            assert.throws(()=>{
                
                classifierManager.fetchUpToNCellPairsByClass(classType, N)

                
            }, 
            
            Error, `Error on invalid class: got ${classType} but expected negative or positive}`)
            
        });

    });


    describe('API: appendToTrainingSetAndRetrainPromise', function() {

        
        it('basic fetch positive/negative cellPairs works and returns something valid', async function() {
            const object_data = [
                [1, 1, 1, 2, 5, 1, 3],
                [2, 2, 3, 4, 6, 2, 5],
                [3, 3, 2, 7, 3, 5, 4]
            ]
            const object_columns = ["ImageNumber", "ObjectNumber", "f1", "f2", "f3", "Nuclei_Location_CenterX", "Nuclei_Location_CenterY"]

            const image_data = [
                [1, "img1A.png", "img1P.png", "img1D.png"],
                [2, "img2A.png", "img2P.png", "img2D.png"],
                [3, "img3A.png", "img3P.png", "img3D.png"]
            ]
            const image_columns = ["ImageNumber", "Image_FileNames_Filename_OrigActin", "Image_FileNames_Filename_OrigpH3", "Image_FileNames_Filename_OrigDNA"]

            const uniformData = {
                object_data,
                object_columns,
                image_data,
                image_columns
            }

            const initialTrainingObject = {
                classifierType: "LogisticRegression",
                trainingData: [{"ImageNumber": 1, "ObjectNumber": 1, "f1": 1, "f2": 2, "f3": 5}, 
                               {"ImageNumber": 2, "ObjectNumber": 2, "f1": 3, "f2": 4, "f3": 6}],
                trainingLabels: [0, 1],
                featuresToUse: ["f1", "f2"]
            }
            const dataProvider = new DataProvider(uniformData)
            const classifierManager = new ClassifierManager(dataProvider, initialTrainingObject)


            const additionalTrainingObject = {
                classifierType: "LogisticRegression",
                trainingData: [{"ImageNumber": 3, "ObjectNumber": 3, "f1": 2, "f2": 7, "f3": 3}],
                trainingLabels: [0],
                featuresToUse: ["f1", "f2"]
            }
            await classifierManager.appendToTrainingSetAndRetrainPromise(additionalTrainingObject)

            const finalTrainingSet = classifierManager.getTrainingSetObject().trainingData
            const expectedFinalTrainingSet = [
                {"ImageNumber": 1, "ObjectNumber": 1, "f1": 1, "f2": 2, "f3": 5},
                {"ImageNumber": 2, "ObjectNumber": 2, "f1": 3, "f2": 4, "f3": 6},
                {"ImageNumber": 3, "ObjectNumber": 3, "f1": 2, "f2": 7, "f3": 3}
            ]
            // check they have same elements and also order matters because of the append order


            assert.deepEqual(finalTrainingSet, expectedFinalTrainingSet)
            
        });

    });

    
});
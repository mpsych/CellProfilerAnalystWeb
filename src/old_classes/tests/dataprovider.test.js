
import {DataProvider} from "../DataProvider"
var assert = require('chai').assert;
import _ from "lodash";



describe('Data Provider tests', function() {

    describe('constructor tests', function() {

        it('fail on pass nothing', function() {
            assert.throws(()=>{
                const p = new DataProvider();
                
            }, 
            
            Error, "Constructor Error on uniform_data is not defined")
            
        });

        it('fail on pass undefined fields in uniform_data', function() {
            
            const object_data = [
                [1, 1, 1, 2, 5, 1, 3],
                [2, 2, 3, 4, 6, 2, 5],
                [3, 3, 2, 7, 3, 5, 4]
            ]
            const object_columns = ["ImageNumber", "ObjectNumber", "f1", "f2", "f3", "Nuclei_Location_CenterX", "Nuclei_Location_CenterY"]

            const image_data = [
                [1, 1, "img1A.png", "img1P.png", "img1D.png"],
                [2, 2, "img2A.png", "img2P.png", "img2D.png"],
                [3, 3, "img3A.png", "img3P.png", "img3D.png"]
            ]
            const image_columns = ["ImageNumber", "ObjectNumber", "Image_FileNames_Filename_OrigActin", "Image_FileNames_Filename_OrigpH3", "Image_FileNames_Filename_OrigDNA"]


            assert.throws(()=>{
                const uniformData = {
                    object_data
                }
                const dataProvider = new DataProvider(uniformData)
            }, Error, "Constructor Error on uniform_data is missing fields")
            assert.throws(()=>{
                const uniformData = {
                    object_columns
                }
                const dataProvider = new DataProvider(uniformData)
            }, Error, "Constructor Error on uniform_data is missing fields")
            assert.throws(()=>{
                const uniformData = {
                    image_data
                }
                const dataProvider = new DataProvider(uniformData)
            }, Error, "Constructor Error on uniform_data is missing fields")
            assert.throws(()=>{
                const uniformData = {
                    image_columns
                }
                const dataProvider = new DataProvider(uniformData)
            }, Error, "Constructor Error on uniform_data is missing fields")
        }); 

        
        it('fail constructor if object_columns has no ImageNumber and ObjectNumber', function() {
            
            

            const object_data = [
                [ 1, 2, 5],
                [ 3, 4, 6],
                [ 2, 7, 3]
            ]
            const object_columns = ["f1", "f2", "f3"]

            const image_data = [
                [ 1, "img1A.png", "img1P.png", "img1D.png"],
                [ 2, "img2A.png", "img2P.png", "img2D.png"],
                [ 3, "img3A.png", "img3P.png", "img3D.png"]
            ]
            const image_columns = ["ImageNumber", "Image_FileNames_Filename_OrigActin", "Image_FileNames_Filename_OrigpH3", "Image_FileNames_Filename_OrigDNA"]

            const uniformData = {
                object_data,
                object_columns,
                image_data,
                image_columns
            }

            assert.throws(()=>{
                const dataProvider = new DataProvider(uniformData)
            }, Error, "Constructor Error on object_columns doesn't have ObjectNumber and ImageNumber")
            

        });

        it('fail constructor if image_columns has no ImageNumber', function() {
            
            

            const object_data = [
                [1, 1, 1, 2, 5, 1, 3],
                [2, 2, 3, 4, 6, 2, 5],
                [3, 3, 2, 7, 3, 5, 4]
            ]
            const object_columns = ["ImageNumber", "ObjectNumber", "f1", "f2", "f3", "Nuclei_Location_CenterX", "Nuclei_Location_CenterY"]

            const image_data = [
                ["img1A.png", "img1P.png", "img1D.png"],
                ["img2A.png", "img2P.png", "img2D.png"],
                ["img3A.png", "img3P.png", "img3D.png"]
            ]
            const image_columns = ["Image_FileNames_Filename_OrigActin", "Image_FileNames_Filename_OrigpH3", "Image_FileNames_Filename_OrigDNA"]

            const uniformData = {
                object_data,
                object_columns,
                image_data,
                image_columns
            }

            assert.throws(()=>{
                const dataProvider = new DataProvider(uniformData)
            }, Error, "Constructor Error on image_columns doesn't have ImageNumber")
            

        });

        it('fail constructor if data_columns doesnt include Nuclei_Location_CenterX or Nuclei_Location_CenterY', function() {
            
            

            const object_data = [
                [1, 1, 1, 2, 5],
                [2, 2, 3, 4, 6],
                [3, 3, 2, 7, 3]
            ]
            const object_columns = ["ImageNumber", "ObjectNumber", "f1", "f2", "f3"]

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

            assert.throws(()=>{
                const dataProvider = new DataProvider(uniformData)
            }, Error, "Constructor Error on uniform_data doesn't have Nuclei_Location_CenterX or Nuclei_Location_CenterY")
            

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

            const dataProvider = new DataProvider(uniformData)
        
            
        });
    });

    describe('API calls', function() {
        


        
        xit('basic get image filenames', function() {
            
            
            const object_data = [
                [1, 1, 1, 2, 5, 1, 3],
                [2, 2, 3, 4, 6, 2, 5],
                [3, 3, 2, 7, 3, 5, 4]
            ]
            const object_columns = ["ImageNumber", "ObjectNumber", "f1", "f2", "f3", "Nuclei_Location_CenterX", "Nuclei_Location_CenterY"]

            const image_data = [
                [1, 1, 'img1A.png', 'img1P.png', 'img1D.png'],
                [2, 2, 'img2A.png', 'img2P.png', 'img2D.png'],
                [3, 3, 'img3A.png', 'img3P.png', 'img3D.png']
            ]
            const image_columns = ["ImageNumber", "ObjectNumber", "Image_FileNames_Filename_OrigActin", "Image_FileNames_Filename_OrigpH3", "Image_FileNames_Filename_OrigDNA"]

            const uniformData = {
                object_data,
                object_columns,
                image_data,
                image_columns
            }

            const dataProvider = new DataProvider(uniformData)

            const imgFileNames_1 = dataProvider.returnAllImgFileNames(1)
            const expected_1 = ["img1A.png","img1P.png","img1D.png"]
            const imgFileNames_2 = dataProvider.returnAllImgFileNames(2)
            const expected_2 = ["img2A.png","img2P.png","img2D.png"]
            const imgFileNames_3 = dataProvider.returnAllImgFileNames(3)
            const expected_3 = ["img3A.png","img3P.png","img3D.png"]

            assert.equal(JSON.stringify(imgFileNames_1), expected_1)
            assert.equal(JSON.stringify(imgFileNames_2), expected_2)
            assert.equal(JSON.stringify(imgFileNames_3), expected_3)
        
        });

        

        it('basic get random cell pairs', function() {
            
            
            const object_data = [
                [1, 1, 1, 2, 5, 1, 3],
                [2, 2, 3, 4, 6, 2, 5],
                [3, 3, 2, 7, 3, 5, 4]
            ]
            const object_columns = ["ImageNumber", "ObjectNumber", "f1", "f2", "f3", "Nuclei_Location_CenterX", "Nuclei_Location_CenterY"]

            const image_data = [
                [1, 1, 'img1A.png', 'img1P.png', 'img1D.png'],
                [2, 2, 'img2A.png', 'img2P.png', 'img2D.png'],
                [3, 3, 'img3A.png', 'img3P.png', 'img3D.png']
            ]
            const image_columns = ["ImageNumber", "ObjectNumber", "Image_FileNames_Filename_OrigActin", "Image_FileNames_Filename_OrigpH3", "Image_FileNames_Filename_OrigDNA"]

            const uniformData = {
                object_data,
                object_columns,
                image_data,
                image_columns
            }

            const dataProvider = new DataProvider(uniformData)

            const N = 2
            const nRandomCellPairs = dataProvider.getNRandomObjs(N)
            
            

            const totalPossibleCellPairs = [{"ImageNumber": 1, "ObjectNumber": 1},
                                            {"ImageNumber": 2, "ObjectNumber": 2},
                                            {"ImageNumber": 3, "ObjectNumber": 3}]

            // chech that each returned pair object is one of the possible pairs
            for (var i = 0; i < N; i++) {
                assert.deepInclude(totalPossibleCellPairs, nRandomCellPairs[i])
                
            }
        
        });

    })
    
});
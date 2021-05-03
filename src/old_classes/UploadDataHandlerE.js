import * as Papa from "papaparse"
import _ from "lodash";



export default class UploadDataHandlerE {

    data = {};
    
    constructor() {
        Promise.prototype.notify = function(strMsg) {
            return this.then(x=>{console.log(strMsg); return x});
          }
          Promise.prototype.debugPrint = function() {
            return this.then(x=>{console.log(x); return x});
        }
        
        FileList.prototype.findFile = function(fileName) {
            var index = Array.from(this.target.files).findIndex((elem) => {
                return elem.name === fileName;
            });
            return this.item(index)
        }
        
        Papa.parsePromise = function(file, config) {
            return new Promise(function(complete, error) {
              Papa.parse(file, {...config, complete, error});
            });
        };

        
        Papa.papaparseFilePromise = function(file, options={}, onEndMsg="") {

            return Papa.parsePromise(file,
                {...this.basicPapaConfig, ...options} 
            )
            .then((result)=> result.data)
            .notify(onEndMsg);
        }
        Papa.papaparseFilePromise_noReturn = function(file, options={}, onEndMsg="") {

            return Papa.parsePromise(file,
                {...this.basicPapaConfig, ...options} 
            )
            .notify(onEndMsg);
        }
    }

    static getInstance = function() {
        if (!UploadDataHandlerE._instance) {
            UploadDataHandlerE._instance = new UploadDataHandlerE();
        }
        return UploadDataHandlerE._instance;
    }
    sliceArrayByValue = function (array, value1, value2) {
        const index1 = array.indexOf(value1);
        const index2 = array.indexOf(value2);
      
        if (value1 === -1 || value2 === -1) {
            console.error("Values not found to slice");
            return null;
        }
      
        return array.slice(index1, index2);
      }

    basicPapaConfig = {
        worker: true,
        skipEmptyLines: true,
        dynamicTyping: true
    }
    

    handleFolderUpload = async function(fileListObject) {
        const setup_name = "example_SETUP.SQL";
        const setup_lines = (await this.fileReaderPromiseText(fileListObject, setup_name)).split('\n').map(e=>e.trim());
        console.log(setup_lines)

        const training_name = "MyTrainingSet.txt";
        const training_file = this.findFile(fileListObject, training_name);
        const training_columns = "label imagenum objectnum x y".split(" ");
        const training_data = 
            (await Papa.papaparseFilePromise(training_file, {delimiter: " ", comments: "#" }))
            .slice(1) // first row is something like: labels positive negative, devoid of info
            .map(training_row => _.zipObject(training_columns, training_row));
        
        console.log(training_data)



        const object_column_lines = this.sliceArrayByValue(
            setup_lines,
            "CREATE TABLE per_object (", 
            "PRIMARY KEY  (ImageNumber,ObjectNumber)"
        );
        const object_column_names = object_column_lines.map((name)=>name.split(' ')[0]).slice(1);
        const object_name = "per_object.csv";
        const object_file = this.findFile(fileListObject, object_name);
        console.time('object data finished')
        var object_data = (await Papa.papaparseFilePromise(object_file,
            {fastMode: true, error: (e)=>console.error(e)} 
        ))
        object_data = object_data.map(data_row=>{ return _.zipObject(object_column_names, data_row)})
        console.timeEnd('object data finished')
        console.log(object_data)

        

        const image_column_lines = this.sliceArrayByValue(
            setup_lines,
            "CREATE TABLE per_image (", 
            "PRIMARY KEY  (ImageNumber)"
        );
        const image_column_names = image_column_lines.map((name)=>name.split(' ')[0]).slice(1);
        const image_name = "per_image.csv";
        const image_file = this.findFile(fileListObject, image_name);
        console.time('image data finished')
        var image_data = (await Papa.papaparseFilePromise(image_file,
            {fastMode: true, error: (e)=>console.error(e)} 
        ))
        image_data = image_data.map(data_row=>{ return _.zipObject(image_column_names, data_row)})
        console.timeEnd('image data finished')

        
        
        this.data.setup_lines = setup_lines;
        this.data.training_data = training_data;
        this.data.training_columns = training_columns;
        this.data.object_data = object_data;
        this.data.object_column_names = object_column_names
        this.data.image_data = image_data;
        this.data.image_column_names = image_column_names;
        //this.grabCellImages(2,4);
    }
    getImageData() {
        return this.data.image_data
    }
    getObjectData() {
        return this.data.object_data
    }
    getInitialTrainingData() {
        return this.data.training_data
    }
    getTrainingColumns() {
        return this.data.training_columns
    }
    getObjectColumnNames() {
        return this.data.object_column_names
    }
    getImageColumnNames() {
        return this.data.image_column_names
    }
    findFileIndex = (fileListObject, fileName) => {
        var index = Array.from(fileListObject.target.files).findIndex((elem) => {
            return elem.name === fileName;
        });
        return index;
    }
    findFile = (fileListObject, fileName) => {
        const fileIndex = this.findFileIndex(fileListObject, fileName);
        return fileListObject.target.files[fileIndex];
    }
    
    fileReaderPromiseText =  function(fileListObject, fileName) {
        const fileIndex = this.findFileIndex(fileListObject, fileName)
        return new Promise((resolve, reject)=> {
            var fr = new FileReader();
            fr.onload = () => {
                resolve(fr.result)
            };
            fr.readAsText(fileListObject.target.files[fileIndex])
        })
    }
    fileReaderPromiseImage(fileListObject, fileIndex) {
        return new Promise((resolve, reject)=> {
            var fr = new FileReader();
            fr.onload = () => {
                resolve(fr.result)
            };
            fr.readAsDataURL(fileListObject.target.files[fileIndex])
        })
    }
}

export {UploadDataHandlerE as DataHandler}
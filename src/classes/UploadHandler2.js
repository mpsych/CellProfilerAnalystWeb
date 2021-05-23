//import DataUtils from "./DataUtils";
import PapaParser from "./PapaParser.js";
import UserUploadFileHandler2 from "./UserUploadFileHandler2.js";
import {Properties} from "./Properties.js"
import {sliceArrayByValue} from './Utils.js'                                                                                                                                                                                                   
import DataProvider from "./DataProvider.js";
import TrainingTable from "./TrainingTable.js";
export default class UploadHandler2 {

    constructor(fileListObject) {
        this.fileListObject = fileListObject
        this.props = null;
    }

    
   /*
        @param {"file_name"}
   */
    getFile(search_name) {
        var file_handler = new UserUploadFileHandler2(this.fileListObject)
        var file = file_handler.findFile(search_name)
        return {'name' : search_name, 'file' : file }
    }

    /*
        @param {'name' : "file_name", 'file': file}
   */
    getText(file_object) {
            if (file_object.name.endsWith(".csv") || file_object.name.endsWith(".txt")) {
                var papa_parser = new PapaParser();
                return papa_parser.papaTextfromCSV(file_object);
            }
            else {
                var file_handler = new UserUploadFileHandler2(this.fileListObject)
                return file_handler.fileReaderPromiseText(file_object.file);
            }

    }
    /*
        @param column_lines
        return {object_table : column array, image_table:column array}
   */
    getColumnLines(column_lines_txt) { 
        var column_info = {
            'object_table' : ["CREATE TABLE per_object (" , 
                        "PRIMARY KEY  (ImageNumber,ObjectNumber)"],
            'image_table' : ["CREATE TABLE per_image (", 
                            "PRIMARY KEY  (ImageNumber)"]
        }
        var table_columns = {}
        var column_lines = column_lines_txt.split('\n').map(e=>e.trim())
        for (var key in column_info) {
            if (column_info.hasOwnProperty(key)) {
                var columns = sliceArrayByValue(
                    column_lines,
                    column_info[key][0],
                    column_info[key][1]
                )
                table_columns[key] = columns.map((name)=>name.split(' ')[0]).slice(1)
            } 
        }
        return table_columns;
    }
    getProperties = async function() {
        var file = this.getFile(".properties")
        console.log(file)
        return this.getText(file)
        .then (text => {
           var prop = new Properties()
           prop.init(text)
           console.log(prop)
           this.props = prop
           return prop
        })
    }
    getDataProvider = async function() {
        var setup_file = this.getFile(this.props.setupFileProperties())
        var data_files = this.props.dataFileProperties()
        var data_info = {}
        return this.getText(setup_file)
        .then(text=> {
            var column_lines = this.getColumnLines(text) 
            for (var key in data_files)  {
                data_info[key] = {}
                data_info[key].columns = column_lines[key]
                data_info[key].file = this.getFile(data_files[key].concat(".csv"))
            } 
        })
        .then(() => {
            var i = 0
            return Promise.all(
            Object.keys(data_info).map(key => {
                data_info[key].index = i++
                return this.getText(data_info[key].file)
            })
        )})
        .then(texts=>{
            for (var key in data_info) 
                data_info[key].data = texts[data_info[key].index]
             return new DataProvider(data_info)
        })
   }
    getTrainingSet = async function() {
        var file_name = this.props.trainingSetProperties()
        if (file_name === -1) return -1
        var file = this.getFile(file_name)
        return this.getText(file)
        .then (text => {
            return new TrainingTable(text.slice(1), "label ImageNumber ObjectNumber x y".split(" "))
        })
    }

}
export {UploadHandler2}

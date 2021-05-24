self.importScripts("https://cdn.jsdelivr.net/npm/papaparse@5.3.0/papaparse.min.js")
self.importScripts("UserUploadFileHandler2.js")
self.importScripts("DataProvider.js")                                                                                                                                                                                                   
self.importScripts("TrainingTable.js")
self.importScripts("PapaParser.js")
self.importScripts("Utils.js")
self.importScripts("Properties.js")
class UploadHandler2 {

    constructor(fileListObject) {
        this.fileListObject = fileListObject
        this.prop = null
    }
   /*
        @param {"file_name"}
             Name of file to look up
        @return {'name': file_name, file: File}
             Object containing all material to look up file and match it to specification. Used by getText
   */
    getFile(search_name) {
        var file_handler = new UserUploadFileHandler2(this.fileListObject)
        var file = file_handler.findFile(search_name)
        return {'name' : search_name, 'file' : file }
    }

    /*
        @param {{'name' : "file_name", 'file': file}}
            of type return argument of getFile, used to handle file correctly
        @return {text} 
            raw text of file, sometimes 2D array, sometimes 1D depending
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
        @param {column_lines_txt}
            from getText 
        @return {object_table : column array, image_table : column array}
             columns in 1D array mapped to the type of table they correspond to
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
    /*
        @return {Properties}
             An object holding all properties from properties folder
   */
    getProperties = async function() {
        var search_string = ".properties"
        var file = this.getFile(search_string)
        return this.getText(file)
        .then (text => {
           var prop = new Properties()
           prop.init(text)
           this.props = prop
        })
    }
    /*
        @return {DataProvider}
             An object holding all properties and interactions with object and image tables
   */
    getDataProvider = async function() {
        var data_info = {}
        var data_files = null
        console.log("test")
        return this.getProperties()
        .then (() => {
            var setup_file = this.getFile(this.props.setupFileProperties())
            data_files = this.props.dataFileProperties()
            console.log("test")
            return this.getText(setup_file)
        })
        .then(text=> {
            var column_lines = this.getColumnLines(text) 
            for (var key in data_files)  {
                data_info[key] = {}
                data_info[key].columns = column_lines[key]
                console.log("test")
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
             return new DataProvider(data_info, this.props)
        })
   }
    /*
        @return {TrainingTable}
             An object holding initial training set of program
   */
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
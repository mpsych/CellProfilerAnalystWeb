import * as Papa from "papaparse"
export default class PapaParser {

    constructor() {
        // Could do the whole thing in here by keeping what configs mapped by key name
        // Maybe faster?
        //Is making multiple of these smart
        this.basicPapaConfig = {
            worker: true,
            skipEmptyLines: true,
            dynamicTyping: true
        }
        this.file_config_options = {
            "per_object.csv" :  {fastMode: true, error: (e)=>console.error(e)} ,
            "per_image.csv" : { error: (e)=>console.error(e)} ,
            "MyTrainingSet.txt" : {delimiter: " ", comments: "#" }
        }

        Papa.parsePromise = function(file, config) {
            return new Promise(function(complete, error) {
              Papa.parse(file, {...config, complete, error});
            });
        };  
        Promise.prototype.notify = function(strMsg) {
            return this.then(x=>{console.log(strMsg); return x});
          }
          Promise.prototype.debugPrint = function() {
            return this.then(x=>{console.log(x); return x});
        }  
        Papa.papaparseFilePromise = function(file, options={}, onEndMsg="") {
    
            return Papa.parsePromise(file, options)
            .then((result)=> result.data)
            .notify(onEndMsg);
        }
        Papa.papaparseFilePromise_noReturn = function(file, options={}, onEndMsg="") {
            return Papa.parsePromise(file, options)
            .notify(onEndMsg);
        }
}
    papaTextfromCSV(file_object) {
        var file_for_papa = file_object.file;
        console.log(file_object.name);
        var option = Object.assign(this.basicPapaConfig, this.file_config_options[file_object.name])
        return Papa.papaparseFilePromise(file_for_papa, option)
    }

}
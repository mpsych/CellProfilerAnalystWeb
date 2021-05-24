//import DataTables from "./DataTables";
self.importScripts("DataTables.js")
class TrainingTable extends DataTables{
    constructor(data_lines, column_lines) {
        super(data_lines, column_lines)
        this.training_lines = data_lines;
    }
    /*
        @param {DataProvider} dataProvider
        @return Array2D
            Corresponding rows of object data to training set
    */
    getInitialTrainingData(dataProvider) {
        return this.data_table.map(row =>{
            const ObjectNumber = row['ObjectNumber'];
            const ImageNumber = row['ImageNumber'];
            return dataProvider.getRowArray('object_data', { ObjectNumber, ImageNumber });
		});
    }
    /*
        @return {Array 1D} trainingLabels
            Get training matrix with indexes that corresspond to data_lines and 
            1 denotes positive label and 0 negative
    */
    getTrainingLabels() {
        return this.data_table.map(row_object => {
            return row_object['label'] === 'positive'? 1 : 0
        })


    }
}
//import DataTables from "./DataTables";
self.importScripts("DataTables.js")
class TrainingTable extends DataTables{
    constructor(data_lines, column_lines) {
        super(data_lines, column_lines)
        this.training_lines = data_lines;
    }
    getTrainingLabels() {
        return this.data_table.map(row_object => {
            return row_object['label'] === 'positive'? 1 : 0
        })


    }
}
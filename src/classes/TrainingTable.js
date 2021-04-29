//import DataTables from "./DataTables";
import { DataTables } from "./DataTables";
export default class TrainingTable extends DataTables  {
    constructor(data_lines, column_lines) {
        super(data_lines, column_lines)
        this.data_lines = column_lines;
    }
    getTrainingLabels() {
        return this.data_table.map(row_object => {
            return row_object['label'] === 'positive'? 1 : 0
        })
    }
    getDataArray() {
        return this.data_lines;
    }   
}
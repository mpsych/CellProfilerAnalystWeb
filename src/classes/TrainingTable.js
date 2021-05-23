import { DataTables } from "./DataTables";
export default class TrainingTable extends DataTables{
    constructor(data_lines, column_lines) {
        super(data_lines, column_lines)
        this.training_lines = data_lines;
        this.features = null
    }
    setFeatures(features) {
        this.features = features.filter((elem)=>!elem.includes("Location") && (elem !== "ObjectNumber") && (elem !== "ImageNumber"))
    }
    getFeatures() {
        return this.features;
    }
    getTrainingLabels() {
        return this.data_table.map(row_object => {
            return row_object['label'] === 'positive'? 1 : 0
        })


    }
}
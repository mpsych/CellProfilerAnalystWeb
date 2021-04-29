import _ from "lodash";
export class DataTables {
    constructor(data_lines, column_lines) {
        this.data_table = data_lines.map(data_row=>{ return _.zipObject(column_lines, data_row)})
        this.column_lines = column_lines;
    }
    find (search_obj = {}) {
                return  _.find(this.data_table, search_obj)
           
        }
    size() {
        return this.data_table.length;
    }
    get(index, key) {
        return _.get(this.data_table[index], key)    
        
    }
    findIndex (search_obj) {
        return _.findIndex(this.data_table, search_obj)
    }
    indexTable (index) {
        return this.data_table[index];
    }
    getColumnLines(){
        return this.column_lines;
    }
    getSize() {
        return this.data_table.length;
    }

    getDataColumnsPaired() {
        return this.data_table;
        
    }
} 
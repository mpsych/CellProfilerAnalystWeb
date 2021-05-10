export class TrainingSet{
    constructor(type, training_lines, column_lines) {
        this.type = type;
        this.training_lines
        this.columnm_lines  
        this.training_columns 
    for (var i = 0; i < this.column_lines.length; i++) {
        this.training_column[this.column_lines[i]] = i;
    }
    var obj_index = this.training_column.ObjectNumber
    var img_index = this.training_column.ImageNumber
    var size = 0
    for (var i = 0, size = 0; i < this.training_lines.length; i++, size++) {
        var img = this.training_lines[i][img_index].toString() 
        var obj = this.training_lines[i][obj_index].toString() 
        var index = img.concat(',',obj)
        this.training_mapped[index] = i
    }
}
    find (search_obj = {}) {
        var row = {}
        var index = this.findIndex(search_obj)
        return this.indexTableGetRow(index)
    }
    get(index, key) {
        if (key in this.training_column && index < this.getSize())
            return this.training_lines[index][this.training_column[key]] 
        return -1

    }    
    findIndex(search_obj) {
        var img;
        var obj;
        var key;
        if (search_obj.hasOwnProperty('ImageNumber') && search_obj.hasOwnProperty('ObjectNumber')) {
            img = search_obj.ImageNumber.toString() 
            obj = search_obj.ObjectNumber.toString() 
            key = img.concat(',',obj)
        }
        if (key in this.training_mapped)
            return this.training_mapped[key]
        
        return -1
    }
    indexTableGetRow(index) {
        var row = {}
        if(index != -1 && index < this.getSize()) {
            var line = this.training_lines[index]
            for(var i = 0; i < this.column_lines.length; i++) {
                var column = this.column_lines[i]
                row[column] = line[i];
            }
            return row
        }
        return index;
    }
    getColumnLines(){
        return this.column_lines;
    }
    getSize() {
    return this.object_lines.length;
    }
    getTrainingLabels() {
        return this.training_lines.map(row => {
            return row[this.training_columns['label']] === 'positive'? 1 : 0
        })
    }
    getFeature2DArray(dataProvider) {
        return this.training_lines.map(lines => {
            var features = dataProvider.getRow
            return 
        })
    }


}

class ImageTable{
    constructor(image_lines, column_lines) {
        this.column_lines = column_lines
        this.image_lines = image_lines;
        this.image_column = {}
        this.image_mapped = {}
        for (var i = 0; i < this.column_lines.length; i++) {
            this.image_column[this.column_lines[i]] = i;
        }
        var obj_index = this.image_column.imageNumber
        var img_index = this.image_column.ImageNumber
        for (var i = 0; i < this.image_lines.length; i++) {
            var key = this.image_lines[i][img_index].toString() 
            this.image_mapped[key] = i
        }

    }
    find (search_obj) {
        var row = {}
        var index = this.findIndex(search_obj)
        return this.indexTableGetRow(index)
    }
    get(index, key) {
        if (key in this.image_column && index < this.getSize())
            return this.image_lines[index][this.image_column[key]] 
        return -1

    }    
    findIndex (search_obj) {
        var img;
        var obj;
        var key;
        if (search_obj.hasOwnProperty('ImageNumber')) {
            key = search_obj.ImageNumber.toString() 
        }
        if (key in this.image_mapped)
            return this.image_mapped[key]
        
        return -1
    }
    indexTableGetRow(index) {
        var row = {}
        if(index != -1) {
            var line = this.image_lines[index]
            for(var i = 0; i < this.column_lines.length; i++) {
                var key = this.column_lines[i]
                row[key] = line[i];
            }
            return row
        }
        return index;
    }
    getColumnLines(){
        return this.column_lines;
    }
    getDataLines(){
        return this.image_lines
    }
    getSize() {
    return this.image_lines.length;
    }
}
    

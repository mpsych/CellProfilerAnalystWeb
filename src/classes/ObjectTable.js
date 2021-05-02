export default class ObjectTable {
    constructor(object_lines, column_lines) {
        this.column_lines = column_lines
        this.object_lines = object_lines;
        this.object_column = {}
        this.object_mapped = {}
        this.imgs_size = {}
        for (var i = 0; i < this.column_lines.length; i++) {
            this.object_column[this.column_lines[i]] = i;
        }
        var obj_index = this.object_column.ObjectNumber
        var img_index = this.object_column.ImageNumber
        var cur_img = 1
        var size = 0
        for (var i = 0, size = 0; i < this.object_lines.length; i++, size++) {
            var img = this.object_lines[i][img_index].toString() 
            var obj = this.object_lines[i][obj_index].toString() 
            var index = img.concat(',',obj)
            this.object_mapped[index] = i
            if (parseInt(img) > cur_img) {
                this.imgs_size[cur_img.toString()] = size; 
                size = 0;
                cur_img++  
            }

        }

     }
     returnObjsPerImg(img) {
        if (img.toString() in this.imgs_size) {
            return this.imgs_size[img.toString()]
        }
        return -1
    }
    firstObjinImg(n) {
        var img = n.toString()
        if (!(this.imgs_size.hasOwnProperty(img))) {
            return -1
        }
        if (this.imgs_size[img] <= 0) {
            return -1
        }
        var i = 1;
        var obj = i.toString()
        var index_key = img.concat(',',obj)  
        while(!(this.object_mapped.hasOwnProperty(index_key))) {
            i++
            obj = i.toString()
            index_key = img.concat(',',obj)  
        }
        return parseInt(obj)
    }
    find (search_obj = {}) {
        var row = {}
        var index = this.findIndex(search_obj)
        return this.indexTableGetRow(index)
    }
    get(index, key) {
        if (key in this.object_column && index < this.getSize())
            return this.object_lines[index][this.object_column[key]] 
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
        if (key in this.object_mapped)
            return this.object_mapped[key]
        
        return -1
    }
    indexTableGetRow(index) {
        var row = {}
        if(index != -1 && index < this.getSize()) {
            var line = this.object_lines[index]
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

}



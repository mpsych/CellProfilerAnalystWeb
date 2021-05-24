
self.importScripts('ImageTable.js')
self.importScripts('ObjectTable.js')
class DataProvider {
    
    constructor(uniform_data, props) {
        this.testConstructorInputPreconditions(uniform_data);

        this.data = {
            'object_data' : new ObjectTable(uniform_data.object_table.data, uniform_data.object_table.columns),
            'image_data' :  new ImageTable(uniform_data.image_table.data, uniform_data.image_table.columns)
        }  
        this.props = props
    }
    testConstructorInputPreconditions(uniform_data) {
        if (uniform_data == undefined) {
            throw new Error("Constructor Error on uniform_data is not defined")
        }
        if (uniform_data.image_table.data== undefined || 
            uniform_data.object_table.data == undefined ||
            uniform_data.image_table.columns == undefined ||
            uniform_data.object_table.columns == undefined) {
            
            throw new Error("Constructor Error on uniform_data is missing fields")
        }
        if (uniform_data.object_table.data[0][0] == undefined) {
            throw new Error("Constructor Error on object_data is not a 2d array")
        }
        if (uniform_data.image_table.data[0][0] == undefined) {
            throw new Error("Constructor Error on image_data is not a 2d array")
        }
        if (uniform_data.object_table.data[0].length !== uniform_data.object_table.columns.length) {
            throw new Error("Constructor Error on object_data length mismatch with object_columns length")
        }
        if (uniform_data.image_table.data[0].length !== uniform_data.image_table.columns.length) {
            throw new Error("Constructor Error on image_data length mismatch with image_columns length")
        }
        if (!uniform_data.object_table.columns.includes("ObjectNumber") ||
            !uniform_data.object_table.columns.includes("ImageNumber")) {
                throw new Error("Constructor Error on object_columns doesn't have ObjectNumber and ImageNumber")
            }
        if (!uniform_data.image_table.columns.includes("ImageNumber")) {
                throw new Error("Constructor Error on image_columns doesn't have ImageNumber")
            }
        if (!uniform_data.object_table.columns.includes("Nuclei_Location_CenterX") ||
            !uniform_data.object_table.columns.includes("Nuclei_Location_CenterY")) {
                throw new Error("Constructor Error on uniform_data doesn't have Nuclei_Location_CenterX or Nuclei_Location_CenterY")
            }
    }
    
    /*
        @param {number} imageNumber
            The number corresponding to the 3 channel file names we want
        @return {Array<{fileName: string, color: string}>} image_paths
            The array of objects containing the filenames and their color
    */
    returnAllImgFileNames(imageNumber) {
        // console.log("returnAllImgFileNames enter")
        var channels = [
            {'file_lookup' : 'Image_FileNames_Filename_OrigActin', 'color' : "red" }, 
            {'file_lookup' : 'Image_FileNames_Filename_OrigpH3'  , 'color' : "green"},
            {'file_lookup' : "Image_FileNames_Filename_OrigDNA"  , 'color' : "blue"}
        ]
         var image_paths = channels.map( channel => {
            var file_name =  this.getValue('image_data', {'ImageNumber': imageNumber, 'value': channel.file_lookup}) 
            return {'filename' : file_name , 'color' : channel.color}   
         });
        //  console.log("returnAllImgFileNames exit")
        return image_paths;
    }
    //TODO what if cell is on edge of image
    getObjsPerImg(img) {
        var size = this.data.object_data.returnObjsPerImg(img);
        if (size <= 0) {
            return -1;
        }
        var first = this.data.object_data.firstObjinImg(img)
        var objsInImg = [];
        for (var obj = first, count = 0; count < size ; obj++) {
            var row = this.data.object_data.find({'ImageNumber': img, 'ObjectNumber': obj})
            if (row != -1) {
                count++
                objsInImg.push(row)
            }
        }
        return objsInImg;
    }
    getNRandomObjs(n) {
        var num_of_objs = this.data.object_data.getSize()
        var rand_objs = []
        var i;
        for (i = 0; i < n; i++) {
            var index = Math.floor(Math.random() * num_of_objs);
            var obj = this.data.object_data.indexTableGetRow(index)
            rand_objs.push({'ImageNumber': obj.ImageNumber, 'ObjectNumber': obj.ObjectNumber })
        }
        return rand_objs
    }
    /*
        @param ("object_data" | "image_data") key 
            The key of the kind of Table to access
        @param ({ImageNumber: int} | {ImageNumber: int, ObjectNumber: int} | {...featureName: number}) search_obj 
            The object of the properties to search for in the Table accessed
        @return {Array<(number | string)> | null} row
            The first row of the accessed Table corresponding to the search object
    */
    getRow(key, search_obj) {
        if (!(this.data.hasOwnProperty(key))) return -1;
        var row = this.data[key].find(search_obj)
        return row;
    }
    getRowArray(key, search_obj) {
        if (!(this.data.hasOwnProperty(key))) return -1;
        var row = this.data[key].findArray(search_obj)
        return row;
    }
    getAllObjRowsIn2DArray(objs) {
        return objs.map

    }

    /*
        @param {{ImageNumber: int, ObjectNumber: int}} search_obj
        @return {x: int, y: int}
    */
    getCoordsforCellDisplay(search_obj) {
        var coords = {};        
        var cellinObj = this.data.object_data.findIndex(search_obj)
        var cellx = parseInt(this.data.object_data.get(cellinObj, 'Nuclei_Location_CenterX'))
        var celly = parseInt(this.data.object_data.get(cellinObj, 'Nuclei_Location_CenterY'))
        // coords.x = Math.max(0, cellx - 20) 
        coords.x = cellx
       // var hi_x = lo_x + 40
        // coords.y = (Math.max(0, celly - 20))
        coords.y = celly
        return coords;
    }
    /*
        @param {{ImageNumber: int, ObjectNumber: int}} search_obj
        @return {value}
    */
    getValue(key, search_obj) {
        if (!this.data.hasOwnProperty(key)) return -1;         
        var value = null
        var index =  this.data[key].findIndex(search_obj)
        if (index !== -1) {
            value = this.data[key].get(index, search_obj.value);
        }
        return value;
    }
    getColumnLines(key) {
        if (this.data.hasOwnProperty(key)) {
            return this.data[key].getColumnLines();
        }
        return null;

    }
    /*
        @param ("object_data" | "image_data") key
            The key of the kind of Table to access
        @return (Array<Array<(number | string)>> | null) dataLines
            The 2D array of the accessed data with feature columns and entry rows
    */
    getDataLines(key) {
        if (this.data.hasOwnProperty(key)) {
            return this.data[key].getDataLines();
        }
        return null;

    }                     

}
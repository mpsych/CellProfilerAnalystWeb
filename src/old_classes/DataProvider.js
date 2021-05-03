
import { ThumbDownSharp } from "@material-ui/icons";
import ImageTable from "./ImageTable.js";
import ObjectTable from "./ObjectTable.js";
export default class DataProvider {
    constructor(uniform_data) {
        


        this.testConstructorInputPreconditions(uniform_data);

        this.data = {
            'object_data' : new ObjectTable(uniform_data.object_data, uniform_data.object_columns),
            'image_data' :  new ImageTable(uniform_data.image_data, uniform_data.image_columns)
        }
        
    }

    testConstructorInputPreconditions(uniform_data) {
        if (uniform_data == undefined) {
            throw new Error("Constructor Error on uniform_data is not defined")
        }
        if (uniform_data.image_data == undefined || 
            uniform_data.object_data == undefined ||
            uniform_data.image_columns == undefined ||
            uniform_data.object_columns == undefined) {
            
            throw new Error("Constructor Error on uniform_data is missing fields")
        }
        if (uniform_data.object_data[0][0] == undefined) {
            throw new Error("Constructor Error on object_data is not a 2d array")
        }
        if (uniform_data.image_data[0][0] == undefined) {
            throw new Error("Constructor Error on image_data is not a 2d array")
        }
        if (uniform_data.object_data[0].length !== uniform_data.object_columns.length) {
            throw new Error("Constructor Error on object_data length mismatch with object_columns length")
        }
        if (uniform_data.image_data[0].length !== uniform_data.image_columns.length) {
            throw new Error("Constructor Error on image_data length mismatch with image_columns length")
        }
        if (!uniform_data.object_columns.includes("ObjectNumber") ||
            !uniform_data.object_columns.includes("ImageNumber")) {
                throw new Error("Constructor Error on object_columns doesn't have ObjectNumber and ImageNumber")
            }
        if (!uniform_data.image_columns.includes("ImageNumber")) {
                throw new Error("Constructor Error on image_columns doesn't have ImageNumber")
            }
        if (!uniform_data.object_columns.includes("Nuclei_Location_CenterX") ||
            !uniform_data.object_columns.includes("Nuclei_Location_CenterY")) {
                throw new Error("Constructor Error on uniform_data doesn't have Nuclei_Location_CenterX or Nuclei_Location_CenterY")
            }
    }
    
    returnAllImgFileNames(img) {
        var channels = "Image_FileNames_Filename_OrigActin Image_FileNames_Filename_OrigpH3 Image_FileNames_Filename_OrigDNA".split(" ");
        return channels.map(path => {          
            return this.getValue('image_data', {'ImageNumber': img, 'value': path })
        });
    }
    //TODO what if cell is on edge of image
    getNRandomObjs(n) {
        var num_of_objs = this.data.object_data.data_table.length
        var rand_objs = []
        var i;
        for (i = 0; i < n; i++) {
            var index = Math.floor(Math.random() * num_of_objs);
            var search_obj =  {'index' : index}
            var obj = this.getRow('object_data', search_obj);
            rand_objs.push({ 'ImageNumber': obj.ImageNumber, 'ObjectNumber': obj.ObjectNumber })
        }
        return rand_objs
    }
    getRow(key, search_obj) { //Where key is a member of data and search obj is of form {'img': , 'objs': , 'index': }
        if (!(this.data.hasOwnProperty(key))) return -1;
        if (search_obj.hasOwnProperty('index')) return this.data[key].indexTable(search_obj.index);
        var row = this.data[key].find(search_obj)
        return row;

    }
    getCordsforCellDisplay(search_obj) {
        var cords = {};        
        var cellinObj = this.getRow('object_data', search_obj)
        var cellx = parseInt(this.getValue('object_data', Object.assign(search_obj, {'value' : 'Nuclei_Location_CenterX' })))
        var celly = parseInt(this.getValue('object_data', Object.assign(search_obj, { 'value' : 'Nuclei_Location_CenterY' })))
        cords.x = Math.max(0, cellx - 20) 
       // var hi_x = lo_x + 40
        cords.y = (Math.max(0, celly - 20))
        return cords;
    }

    getValue(key, search_obj) {
        if (!this.data.hasOwnProperty(key)) return -1;
        var value = -1;
        var value = search_obj.value;
        var copy = Object.assign({}, search_obj);
        delete copy.value; //Allows to use other methods in class {obj: 1, img : 1, value :3} -> {obj: 1, img: 1}
        var index =  this.data[key].findIndex(copy)
        if (index !== -1) {
            value = this.data[key].get(index, search_obj.value);
        }
        return value;
    }
    getColumnLines(key) {
        if (this.data.hasOwnProperty(key)) {
            return this.data[key].getColumnLines();
        }
        return -1;

    }

}

export {DataProvider}
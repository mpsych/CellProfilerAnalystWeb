
import { ThreeSixty, ThumbDownSharp } from "@material-ui/icons";
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
        var channels = [
            {'file_lookup' : 'Image_FileNames_Filename_OrigActin', 'color' : "red" }, 
            {'file_lookup' : 'Image_FileNames_Filename_OrigpH3'  , 'color' : "green"},
            {'file_lookup' : "Image_FileNames_Filename_OrigDNA"  , 'color' : "blue"}
        ]
         var image_paths = channels.map( channel => {
            var file_name =  this.getValue('image_data', {'ImageNumber': img, 'value': channel.file_lookup}) 
            return {'filename' : file_name , 'color' : channel.color}   
         });
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
    getRow(key, search_obj, ) { //Where key is a member of data and search obj is of form {'img': , 'objs': , 'index': }
        if (!(this.data.hasOwnProperty(key))) return -1;
        var row = this.data[key].find(search_obj)
        return row;

    }
    getAllObjRowsIn2DArray(objs) {
        return objs.map

    }
    getCordsforCellDisplay(search_obj) {
        var cords = {};        
        var cellinObj = this.data.object_data.findIndex(search_obj)
        var cellx = parseInt(this.data.object_data.get(cellinObj, 'Nuclei_Location_CenterX'))
        var celly = parseInt(this.data.object_data.get(cellinObj, 'Nuclei_Location_CenterY'))
        cords.x = Math.max(0, cellx - 20) 
       // var hi_x = lo_x + 40
        cords.y = (Math.max(0, celly - 20))
        return cords;
    }

    getValue(key, search_obj) {
        if (!this.data.hasOwnProperty(key)) return -1;         
        var value = -1
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
        return -1;

    }                     

}

export {DataProvider}
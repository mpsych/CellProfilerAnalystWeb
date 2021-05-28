self.importScripts('FoundImage.js')
//Minimual class to support constant indexing with a given index
//Send line of image data or object data and it will keep indexes
//and give them in constant time'
//made to be super lightweight
//dataprovider2 comments in constructor show it being made
class ImageObjectTable {
    constructor(data, props) {
        //Map object columns to indexes -probably not nescessary
        this.object_columns = {}
        for (var i = 0; i < data.object_table.columns.length; i++) {
            this.object_columns[data.object_table.columns[i]] = i;
        }
        //Map image columns to indexes -probably not nescessary
        this.image_columns = {}
        for (var i = 0; i < data.image_table.columns.length; i++) {
            this.image_columns[data.image_table.columns[i]] = i;
        }
        this.images_mapped = {} // for each image keeps
                                // image_number : [ index, {object1: index, object2: index}] 
                                // where object1..n refer to the objects in the image the value index
                                //is there index
        this.column_props = props.columnProperties()  //properties, bur arent exactly nescessary
        this.table_columns = {'index': 0, 'objects': 1} //just values of referencing the value array
                                                        //with key image numbers held in images_mapped 
        this.size = 0;  //number of images. If initialized more dynamically will have to be initialized
                        //with the total lines in image data
    }
    //init with index from original table and line of data though could be just
    //image number, if index is -1, created by initObjectData
    initImageData(i, data) { 
        var image_id = data[this.image_columns[this.column_props.image_id]] //get relevant data from image line
        if (this.images_mapped.hasOwnProperty(image_id)) { //if already defined change index
            this.images_mapped[image_id.toString()][table_columns.index] = i
        }
        this.images_mapped[image_id.toString()] = [i, {}] //put starting value in images_mapped where i is
                                                          //the index it appears at
        this.size++ //Only accurate this way if everything scanned
    }
    //init with index from original table and line of data though only image and object id are really needed
    initObjectData(i, data) { 
        var image_id = data[this.object_columns[this.column_props.image_id]] //get image and object numbers
        var object_id = data[this.object_columns[this.column_props.object_id]]
        if (!this.images_mapped.hasOwnProperty(image_id)) {  //Check if image exist, if doesn't init image with
                                                             // -1 index
            this.initImageData(-1, image_id)
        }
        var found_image = this.images_mapped[image_id.toString()] 
        var objects = found_image[this.table_columns.objects]
        objects[object_id.toString()] = i
    }
    //Not accurate right now if all images not initialized
    totalNumberOfImages() {
        return size
    }
    //This methods size return gets complicated if initiailized dynamically but can be changed
    //to work if the number of indexes is at least counted between each object and then set
    totalNumberOfObjectsperImage(image_number) {
        var found_image;
        if (this.images_mapped.hasOwnProperty(image_number)) {
            found_image = this.images_mapped[image_number.toString()]
            var objects = found_image[this.table_columns.objects]
            return Object.keys(objects).length
        }
        else -1
    }
    //Below are methods for retrieving an image or object which are all numbers               
    getIndexofImage(image_number) {
        if (this.images_mapped.hasOwnProperty(image_number.toString())) {
            var found_image = this.images_mapped[image_number.toString()]
            return found_image[this.table_columns.index]
        }
        return -1

    }
    getIndexofObject(image_number, object_number) { 
        if (!this.images_mapped.hasOwnProperty(image_number)) 
            return -1
        var found_image = this.images_mapped[image_number.toString()]
        var objects = found_image[this.table_columns.objects]
        if (!objects.toString().hasOwnProperty(object_number.toString())) {
            return -1
        }
        return objects[object_number]
        
        
        
    }

}
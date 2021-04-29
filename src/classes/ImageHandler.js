import {ImageProvider2} from './ImageProvider2';
import UserUploadFileHandler from '../classes/UserUploadFileHandler'
export default class ImageHandler {
    constructor(fileListObect, data_provider) {
        this.file_handler = new UserUploadFileHandler(fileListObect)
        this.data_provider = data_provider
        this.images_seen = {};
    }
    getObjsToURLs = async function(objects) { // takes {ImageNumber: .. ObjectNumber: .. }
        var urls = [];
        for (var i = 0; i < objects.length; i++) {
            var cur_ImageNum = objects[i].ImageNumber;
            var image_info = [];
            //if image is already seen, needs to be fixed to take care of the canvas
            //objects
            if (this.images_seen.hasOwnProperty(cur_ImageNum.toString())) {
                 image_info = Object.assign({}, this.images_seen[cur_ImageNum.toString()]);
             }
             else {
                 var key = cur_ImageNum.toString();
                 image_info = await this.getImagefromFile(cur_ImageNum)
                 this.images_seen[key] = image_info;
             }
             var cords = this.data_provider.getCordsforCellDisplay(objects[i])
             var ip = new ImageProvider2(image_info, cords)
             var url = await ip.getDataURL()
             urls.push(url)           
         }
         return urls;

    }
    getImgUrl = async function(object) { //takes {ImageNumber:...}
        var images = this.getImagesfromFile(object);
        var ip = new ImageProvider2(images)
        return ip.getDataUrl()
    }
    // returns array of
    getImagefromFile = async function(object) {
        var images_path = this.data_provider.returnAllImgFileNames(object)
        var images = await Promise.all(images_path.map(image_path => {
            var file = this.file_handler.findFile(image_path.filename)
            return this.file_handler.fileReaderPromiseImage(file).then( image =>{
                return this.makeImage(image);
            })
         }))
        var image_info = []
        for (var i = 0; i < images.length; i++) {
            delete images_path.filename
            images_path[i].image = images[i]
        }
        return images_path
    }
    makeImage(image) {
        var img = new Image()
        img.src = image
        return img
    }
}
export {ImageHandler}
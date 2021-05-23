import {ImageProvider2} from './ImageProvider2';
import UserUploadFileHandler from './UserUploadFileHandler'
export default class ImageHandler {
    
    constructor(fileListObect, data_provider) {
        this.file_handler = new UserUploadFileHandler(fileListObect)
        this.data_provider = data_provider
    }

    getObjsToURLs = async function(objects) { // takes {ImageNumber: .. ObjectNumber: .. }
        var urls = [];
        for (var i = 0; i < objects.length; i++) {
            var cur_ImageNum = objects[i].ImageNumber;
            var image_info = [];
            var key = cur_ImageNum.toString()
            image_info = await this.getImagefromFile(cur_ImageNum)
             var cords = this.data_provider.getCordsforCellDisplay(objects[i])
             var ip = new ImageProvider2({cords: cords})
             var url = await ip.getDataURL(image_info)
             urls.push(url)           
         }
         return urls;

    }
    getImgUrl = async function(object) { //takes {ImageNumber:...}
        var image_info = this.getImagesfromFile(object);
        var ip = new ImageProvider2({image_type: 'whole'})
        return ip.getDataUrl(image_info)
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
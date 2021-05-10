
self.importScripts('ImageProvider2.js')
self.importScripts('UserUploadFileHandler.js')
class ImageHandler {
    constructor(fileListObect, data_provider) {
        this.file_handler = new UserUploadFileHandler(fileListObect)
        this.data_provider = data_provider
        this.images_seen = {};
    }

    /*
        @param {Array<{ImageNumber: int, ObjectNumber: int}>} cellPairs
            The array of cell pairs that we want to return as urls
        @return {Array<DOMString>} urls
            The array of urls corresponding to the cellPairs
    */
    getObjsToURLs = async function(cellPairs) { 
        var urls = [];
        for (var i = 0; i < cellPairs.length; i++) {
            var cur_ImageNum = cellPairs[i].ImageNumber;
            var image_info = [];
 
            var key = cur_ImageNum.toString()
            image_info = await this.getImagesByNumber(cur_ImageNum)
            // this.images_seen[key] = image_info

             var coords = this.data_provider.getCoordsforCellDisplay(cellPairs[i])
             var ip = new ImageProvider2(image_info, coords)
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
    /*
        @param {number} imageNumber
            The number corresponding to the image file
        @return {Array<{image: Image, color: string}>}
    */
    getImagesByNumber = async function(imageNumber) {
        console.log(imageNumber)
        var images_paths_object = this.data_provider.returnAllImgFileNames(imageNumber)

        var images = await Promise.all(images_paths_object.map(image_path => {
            var file = this.file_handler.findFile(image_path.filename)
            return this.makeImagePromise(URL.createObjectURL(file))
         }))
        for (var i = 0; i < images.length; i++) {
            delete images_paths_object.filename
            images_paths_object[i].image = images[i]
        }
        return images_paths_object
    }

    /*
        @param {DOMString} newSrc
        @return {Promise<Image>}
    */
    makeImagePromise(newSrc) {
        return new Promise(resolve => {
            var img = new Image()
            img.onload(()=>{
                resolve(img)
            })
            img.src = newSrc
        })
    }
}

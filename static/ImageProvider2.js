

class ImageProvider2 {
    constructor(img_info, coords = {}, box_dim = {}, image_type = 'object') { // {images_info : [{image : image channel: color} x 3] cord_x: x, cord_y: y }
        this.img_info = img_info
        this.dimensions = box_dim
        this.image_type = image_type
        this.coords = coords
        this.canvases = {}

    }
    setDimensionsofImg() {
        if (this.image_type === 'object') {  // if no cords
            this.dimensions.x = 40;
            this.dimensions.y = 40
        }
        if (this.image_type === 'image') {
            this.dimensions.x = this.img_info[0].image.width
            this.dimensions.y = this.img_info[0].image.height
        }
    }
    async getDataURLPromise() {
        this.setDimensionsofImg()
        var main_canvas = new OffscreenCanvas(this.dimensions.x, this.dimensions.y); 
    
        var ctx = main_canvas.getContext('2d');  
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, main_canvas.width, main_canvas.height); 

        for (var i = 0; i < this.img_info.length; i++) {
            var colorName = this.img_info[i].color.toString()
            
            this.canvases[colorName] = this.createColorCanvas(this.img_info[i].image, colorName, this.coords, this.dimensions)
        }

        ctx.globalCompositeOperation = 'lighter';
        for (var i = 0; i < this.img_info.length; i++) {
                var colorName = this.img_info[i].color;
                ctx.drawImage(this.canvases[colorName], 0, 0)
        
        }


        this.normalizeBrightness(main_canvas)
       
        // restore to default
        ctx.globalCompositeOperation = 'source-over';       
        return main_canvas.convertToBlob()
            .then((blob) => {
                return URL.createObjectURL(blob)
            })     
 }

    createColorCanvas (image, color, coords, dimensions) {
        var canvas = new OffscreenCanvas(this.dimensions.x, this.dimensions.y);
        // image.crossOrigin = 'Anonymous';  
        const width = dimensions.x
        const height = dimensions.y

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.globalCompositeOperation='source-over'; 
        // console.log(image)
        // only grab for ex 40x40 image at center coordinates on image and draw totally in new canvas
        const topLeftCoordx = coords.x-width/2
        const topLeftCoordy = coords.y-width/2
        ctx.drawImage(image,  topLeftCoordx, topLeftCoordy, width, height, 0, 0, width, height )

        // draw the color on, but do not draw over the edge of the image
        const startx = Math.max(-topLeftCoordx, 0)
        const starty = Math.max(-topLeftCoordy, 0)
        const offEndx = Math.max(0, topLeftCoordx+width - image.width )
        const offEndy = Math.max(0,topLeftCoordy+width - image.height)
        const durationx = width-startx - offEndx
        const durationy = height-starty - offEndy

        // console.log(startx, starty, offEndx, offEndy, durationx, durationy)
        ctx.globalCompositeOperation='multiply';
        ctx.fillStyle = color;
        ctx.fillRect(startx, starty, durationx ,durationy)
        // restore to default
        ctx.globalCompositeOperation='source-over'; 
        return canvas
    };

    /*
        @param {Canvas} canvas
            some sort of Canvas object such as OffscreenCanvas or CanvasElement
        @return {void} 
            This function mutates the canvas to be brightness normalized
    */
    normalizeBrightness(canvas) {
        const ctx = canvas.getContext("2d")
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data

        var maxValue = 0
        for (var i = 0; i < data.length; i += 4) {
            const possibleMaxValue = Math.max(data[i], data[i+1], data[i+2])
            if (possibleMaxValue > maxValue) {
                maxValue = possibleMaxValue
            }
        }

        for (var i = 0; i < data.length; i += 4) {
            data[i] = (data[i] / maxValue) * 255
            data[i+1] = (data[i+1] / maxValue) * 255
            data[i+2] = (data[i+2] / maxValue) * 255
            data[i+3] = 255
        }

        ctx.putImageData(imageData, 0, 0);
    }

}

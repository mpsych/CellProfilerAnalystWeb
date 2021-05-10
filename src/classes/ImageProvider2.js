

export default class ImageProvider2 {
    constructor(img_info, cords = {}, box_dim = {}, image_type = 'object') { // {images_info : [{image : image channel: color} x 3] cord_x: x, cord_y: y }
        this.img_info = img_info
        this.box_dim = box_dim
        this.image_type = image_type
        this.cords = cords
        this.canvases = {}

    }
    setDimensionsofImg() {
        if (this.image_type === 'object') {  // if no cords
            this.box_dim.h = 40;
            this.box_dim.l = 40
        }
        if (this.image_type === 'image') {
            this.box_dim.l = this.img_info[0].image.width
            this.box_dim.h = this.img_info[0].image.height
        }
    }
    getDataURL() {
        this.setDimensionsofImg()
        var main_canvas = document.createElement(`canvas`); 
    
        main_canvas.width = this.img_info[0].image.width;
        main_canvas.height = this.img_info[0].image.height;  
        var ctx = main_canvas.getContext('2d');   

        for (var i = 0; i < this.img_info.length; i++) {
            var canID = this.img_info[i].color
            var canvas = document.createElement(`canvas`)
            this.canvases[canID] = canvas
      }

      for(var i = 0; i < this.img_info.length; i++) {
            var canID = this.img_info[i].color.toString()
            this.createColorCanvas(this.img_info[i].image, canID)
       }
       ctx.globalCompositeOperation = 'lighter';
       for (var i = 0; i < this.img_info.length; i++) {
            var img_channel = this.img_info[i];
            ctx.drawImage(this.canvases[img_channel.color], this.cords.x, this.cords.y,
            this.box_dim.h, this.box_dim.l, 0, 0, main_canvas.width, main_canvas.height)
     
       }
     ctx.globalCompositeOperation = 'source-over';              
     return main_canvas.toDataURL();
 }
 
    // initialzeCanvases() {     
    //     return this.images_info.map(image_info => { //images_info = [{image : image, channel: color, cord_x: x, cord_y: y, canvas: canvas}] {}}
    //         var canvas = document.getElementById("canvas");
    //         var canvas_obj = {'canvas': canvas} 
    //         var a = Object.assign(image_info, canvas_obj);    
    //         console.log(a)
    //         return a;
    //     })
    // }
    createColorCanvas (image, color) {
    /* console.log(image) */
    var height = image.height;
    var width =  image.width;  
    // image.crossOrigin = 'Anonymous';  
    this.canvases[color].width = width;
    this.canvases[color].height = height;
    var ctx = this.canvases[color].getContext("2d");
    ctx.globalCompositeOperation='source-over'; 
    ctx.drawImage(image,  0, 0 )
    ctx.globalCompositeOperation='multiply';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width ,height);  
    ctx.globalCompositeOperation='source-over'; 
    // var imagedata = ctx.getImageData(this.cords.x, this.cords.y, 40, 40)
    // var data = imagedata.data
    // var max = -1
    // var obj = {}
    // for (var i = 0; i < data.length; i += 4) {
    //     if (data[i] > max) max = data[i]
    //     if (!(color === 'red' && data[i] > 20)) 
    //         obj[key] = data[i]

    // }
    // for (var key in obj) {
    //     var index = parseInt(key)
    //     data[key] = ((data[key]) / max) * 255 
    // }
    // ctx.putImageData(new ImageData(data, 40, 40), this.cords.x, this.cords.y)
 }
    //from https://stackoverflow.com/questions/10521978/html5-canvas-image-contrast
    // contrastImage(imgData, contrast){  //input range [-100..100]
    //     var d = imgData.data;
    //     contrast = (contrast/100) + 1;  //convert to decimal & shift range: [0..2]
    //     var intercept = 128 * (1 - contrast);
    //     for(var i=0;i<d.length;i+=4){   //r,g,b,a
    //         d[i] = d[i]*contrast + intercept;
    //         d[i+1] = d[i+1]*contrast + intercept;
    //         d[i+2] = d[i+2]*contrast + intercept;
    //     }
    //     return imgData;
    // }yarn 
};

export {ImageProvider2}




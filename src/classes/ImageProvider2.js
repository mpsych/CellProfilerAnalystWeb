
export default class ImageProvider2 {
    constructor(options = {box_dim : {x: 40, y: 40}, image_type : 'object', cords : {}}) { // {images_info : [{image : image channel: color} x 3] cord_x: x, cord_y: y }
        this.box_dim = options.box_dim
        this.image_type = options.image_type
        this.cords = options.cords
        this.canvases = {}

    }
    brighten(canvas, ctx) {
        var imagedata = ctx.getImageData(0, 0, canvas.height, canvas.width)
        var data = imagedata.data
        var color_index = ['red','green','blue']
        var ignore_pixels = [15, 15, 0]
        var max_colors = [-1, -1, -1]
        var min_colors = [256, 256, 256]
        var colors_to_change =[[], [],[]]
        for (var i = 0; i < color_index.length; i++) 
            colors_to_change[color_index[i]] = []
        for (var i = 0; i < data.length; i += 4) {
            for (var j = 0; j < color_index.length; j++) {
                var color_current = data[i + j]
                max_colors[j] = max_colors[j] < color_current ? color_current : max_colors[j]
                min_colors[j] = min_colors[j] > color_current ? color_current : min_colors[j]
                  if (color_current > ignore_pixels[j]) {
                      colors_to_change[j].push(i+j)
                }
        } 
        }
        var max = -1;
        for (var i = 0; i < 3; i++) {
            if (max_colors[i] > max)  max = max_colors[i] 
        } 
        // for (var i = 0; i < data.length; i += 4) {
        //     for (var j = 0; j < color_index.length; j++) {
        //         if (data[i+j] > ignore_pixels[j]) {
        //             data[i+j] = (data[i+j] / max) * 255
        //         }
        // } 
        // }
        for (var i = 0; i < color_index.length; i++) {
        var pixels_to_change = colors_to_change[i]    
        for (var j = 0; j < pixels_to_change.length ; j++) {
            data[pixels_to_change[j]] = (data[pixels_to_change[j]] / max) * 255
        }
  }
        ctx.putImageData(new ImageData(data, imagedata.width, imagedata.height), 0, 0)
    }
    getDataURL(img_info) {
        if (this.image_type === 'image') {
            this.box_dim.x = img_info[0].image.width
            this.box_dim.y = img_info[0].image.height
        }
        var main_canvas = document.createElement(`canvas`); 
    
        main_canvas.width = this.box_dim.h;
        main_canvas.height = this.box_dim.l;  
        var ctx = main_canvas.getContext('2d');   

        for (var i = 0; i < img_info.length; i++) {
            var canID = img_info[i].color
            var canvas = document.createElement(`canvas`)
            this.canvases[canID] = canvas
      }
      for(var i = 0; i < img_info.length; i++) {
            var canID = img_info[i].color.toString()
            this.createColorCanvas(img_info[i].image, canID)
       }
       ctx.globalCompositeOperation = 'lighter';
       for (var i = 0; i < img_info.length; i++) {
            var img_channel = img_info[i];
            if (this.image_type === 'whole') {
                ctx.drawImage(this.canvases[img_channel.color], 0, 0) 
            }
            ctx.drawImage(this.canvases[img_channel.color], this.cords.x, this.cords.y,
            this.box_dim.x, this.box_dim.y, 0, 0, main_canvas.width, main_canvas.height)
       }
     ctx.globalCompositeOperation = 'source-over';     
    this.brighten(main_canvas, ctx)       
     return main_canvas.toDataURL();
 }
 
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




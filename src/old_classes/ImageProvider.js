
import * as tf from '@tensorflow/tfjs'
export default class ImageProvider {
    constructor() {
    }


getDataURLPromise(promise_images, cords = {}) {
    return Promise.all(promise_images).then(images => {
        return Promise.all( images.map(image => {
            return this.createRGB(image)
        }))
    })
    .then (rgb_images => {
        return tf.stack(rgb_images,2).squeeze()
    })
    .then(color_image => {
        return this.createDataURL(color_image, cords)
    })
      
     
}

createDataURL (color_image, cords) {
    var canvas_at_index = document.createElement(`canvas`);
    canvas_at_index.width = 500;
    canvas_at_index.height = 600;
    var ctx_at_index = canvas_at_index.getContext("2d");
    var temp_canvas = document.createElement('canvas');  
    return tf.browser.toPixels(color_image, temp_canvas).then(()=>{
            if(cords.hasOwnProperty('x') && cords.hasOwnProperty('x') )
               ctx_at_index.drawImage(temp_canvas, cords.x, cords.y, 40, 40, 0, 0, canvas_at_index.width, canvas_at_index.height)
            else    
                ctx_at_index.drawImage(temp_canvas, cords.x, cords.y, 40, 40, 0, 0, canvas_at_index.width, canvas_at_index.height)
            temp_canvas.remove();  
            return canvas_at_index.toDataURL();             
    })
 }

createRGB(img) {
    return new Promise((resolve, reject)=> {
        var img_tf;
        var newImg = new Image();
        newImg.onload = (()=> {
            img_tf = tf.browser.fromPixels(newImg, 1)
            resolve(img_tf);
        })
    newImg.src = img
    })
}}
export {ImageProvider}
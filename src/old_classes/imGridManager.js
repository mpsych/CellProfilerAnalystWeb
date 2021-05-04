
import _ from "lodash"; 

class ImageGridManager {

    classifications = []
    
    constructor(data_pairs, dataurls) {

      
      if (!data_pairs || !dataurls) {
          throw new Error("Constructor Error on no data url or data pairs passed in")
      }

      if(data_pairs.length !== dataurls.length){
        throw new Error("Constructor Error on mismatched data pair and dataurl length") 
      }

      this.data_pairs = data_pairs
      this.dataurls = dataurls
  
      for(var i = 0; i < this.data_pairs.length; i++){
      this.classifications.push("unclassified")
      }

    }

    static getDataUrlFromImg(img) {
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // Set width and height
      //canvas.width = img.width;
      //canvas.height = img.height;
      //console.log(img)
      const image_object = new Image()
      image_object.onload = (() => {
          ctx.drawImage(image_object, 0, 0)
          //console.log(canvas.toDataURL())
          //(canvas.toDataURL().length);
      })
      image_object.src = img;
      image_object.crossOrigin = "Anonymous"
      
      var outputURL = canvas.toDataURL()
      return outputURL
      // Draw the image
      //ctx.drawImage(img, 0, 0);

    }

    getNumberImages () {
      return this.data_pairs.length
    }


    getDataUrlByIndex (index) {
      return this.dataurls[index]
    }

    setImageClassByIndex (index, gridType) {
      if(index === undefined || gridType === undefined){
        throw new Error 
        ("setImageClassByIndex Error must have 2 arguments: index and class")
      }

      if(_.includes(["unclassified", "positive", "negative"], gridType)){
        this.classifications[index] = gridType
      }

      else{
        throw new Error
        ("setImageClassByIndex Error incorrect class to set:" +" "+gridType+ ", must be: unclassified, positive, negative")
      }
    }

    //get indices of all occurences of gridType
    getAllIndexes(arr, val) {
      var indexes = [], i = -1;
      while ((i = arr.indexOf(val, i+1)) != -1){
          indexes.push(i);
      }
      return indexes;
    }

    getPairsByClass (gridType) {

      if(_.includes(["unclassified", "positive", "negative"], gridType)){
        const final = []
        var indices = this.getAllIndexes(this.classifications, gridType)
        for(var i = 0; i < indices.length; i++){
          final.push(this.data_pairs[indices[i]])
        }
        return final
      }
      else {
        throw new Error 
        ("wrong class entered")
      }

    }

    setClassByIndexArray (gridType, arr) {
      if(_.includes(["unclassified", "positive", "negative"], gridType)){
        for(var i = 0; i < arr.length; i++){
          this.classifications[arr[i]] = gridType
        }
      }
      else {
        throw new Error
        ("wrong class entered")
      }
    }
  //   render(){
      
    
  //     const urls = [];
  //     //construct list of dataUrls
  //     urls.push(imGridManager.getDataUrlFromImg(Elephant))
  //     urls.push(imGridManager.getDataUrlFromImg(cheetah))
  //     urls.push(imGridManager.getDataUrlFromImg(puggy))
  //     urls.push(imGridManager.getDataUrlFromImg(labrador))
  //     urls.push(imGridManager.getDataUrlFromImg(cat))
      
  //     //console.log(urls[0])

  //     const data_pairs = [{
  //         "ImageKey": 2, 
  //         "ObjectKey" : 3
  //          },
  //          {
  //           "ImageKey": 3,
  //           "ObjectKey":4   
  //          },
  //          {
  //           "ImageKey": 4,
  //           "ObkectKey": 5  
  //          },
  //          {
  //           "ImageKey":5,
  //           "ObjectKey":6
  //          },
  //          {
  //           "ImageKey": 6,
  //           "ObjectKey": 7
  //          }
  //       ]

  //     const classifications = []
  //     var size = data_pairs.length
      
  //     //create classfication array and fill up indices up to size of 
  //     // data_pair array
  //     for(var i = 0; i < size; i++){
  //       classifications.push("unclassified")
  //     }
  //     //console.log(classifications)
      
      
  //     //test get_url_by_ID function
  //     //const val = get_url_by_ID(2)
  //     //console.log(val)
    
      

  //     //test get_number_images function
  //     //console.log(get_number_images(data_pairs))

      
  //     set_grid_prop(1, "positive")
  //     set_grid_prop(2, "negative")
  //     //console.log(classifications)

  //     const get_pairs = (gridType) => {
  //         const pairs = []
  //         for(var i = 0; i < classifications.length; i++){
  //             if(classifications[i] === gridType){
  //                 pairs.push(data_pairs[i])
  //             }
  //         }
  //         return pairs
  //     }

  //     console.log(get_pairs("unclassified"))
  //     return;
  //     // return (
  //     //    <div>
  //     //        <p>imGridManager</p>
  //     //    </div>
         
  //     //    );
 
  //  }

}
export {ImageGridManager} 
//ReactDOM.render(<imGridManager />, document.getElementById('root'));

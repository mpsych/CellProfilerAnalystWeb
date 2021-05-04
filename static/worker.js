self.importScripts("https://cdn.jsdelivr.net/npm/papaparse@5.3.0/papaparse.min.js")
self.initialized = false
self.onmessage = async (event) => {


    if (event.data.action === "init") {
        console.log("initialized worker")
        const fileListObject = event.data.fileListObject
        Papa.parse(fileListObject[5], {
            dynamicTyping: true,
            fastMode: true,
            skipEmptyLines: true,
            complete: (results) =>{
                self.objectData = results.data; 
                self.initialized = true
                constructLookUpTables()
                self.postMessage({action: "test", object_mapped : self.object_mapped}); 
                console.log(self.object_mapped)
                console.log(self.imgs_size)
            }
        })
    }
    else if (event.data.action === "get_row" && self.initialized) {
        self.postMessage({action: "get_row", row: self.objectData[event.data.index], uuid: event.data.uuid})
    } 
    else {
        if (self.initialized) {
            console.log("Error: invalid action")
        }
        else {
            console.log("Error: webworker not initialized yet")
        }
        
    }

}
const constructLookUpTables = function() {
    self.object_column = {}
    self.object_mapped = {}
    self.imgs_size = {}
    var obj_index = 1
    var img_index = 0
    console.log(self.objectData[0][1])
    for (var i = 0, size = 0; i < self.objectData.length; i++, size++) {
      //  if (self.objectData[i] === null) 
        var img = self.objectData[i][img_index].toString() 
        var obj = self.objectData[i][obj_index].toString() 
        var index = img.concat(',',obj)
        self.object_mapped[index] = i
        if (!self.imgs_size.hasOwnProperty(img)) {
            self.imgs_size[img] = 0; 
        }
        self.imgs_size[img]++
    }
 }

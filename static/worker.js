self.importScripts("https://cdn.jsdelivr.net/npm/papaparse@5.3.0/papaparse.min.js")
self.initialized = false
self.onmessage = async (event) => {
    console.log("got here")
    console.log(Papa)

    if (event.data.action === "init") {
        const fileListObject = event.data.fileListObject
        Papa.parse(fileListObject[5], {
            dynamicTyping: true,
            fastMode: true,
            complete: (results) =>{self.postMessage({
                action: "init", objectData:results.data}); 
                self.objectData = results.data; 
                self.initialized = true
            }
        })
    }
    else if (event.data.action === "get_row" && self.initialized) {
        self.postMessage({action: "get_row", row:self.objectData[35000]})
    } else {
        console.log("Error: invalid action nothing passed back or not initialized yet")
    }
    
};


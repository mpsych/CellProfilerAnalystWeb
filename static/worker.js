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
                self.postMessage({action: "init"})
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
    
};


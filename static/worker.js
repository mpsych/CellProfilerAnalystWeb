self.importScripts("https://cdn.jsdelivr.net/npm/papaparse@5.3.0/papaparse.min.js")
self.onmessage = async (event) => {
    console.log("got here")
    console.log(Papa)

    const fileListObject = event.data.fileListObject
    Papa.parse(fileListObject[5], {
        complete: (results) =>self.postMessage({objectData:results.data})
    })
    // if ($event && $event.data && $event.data.msg === 'incApple') {
    //     const newCounter = incApple($event.data.countApple);
    //     self.postMessage(newCounter);
    // }
    
};

function incApple(countApple) {
    const start = Date.now();
    while (Date.now() < start + 5000) {
    }
    return countApple + 1;
}
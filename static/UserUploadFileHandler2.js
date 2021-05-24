 class UserUploadFileHandler2 {

    constructor(fileListObject) {

        this.fileListObject = fileListObject

    }
    findAllFiles(file_names) {
        return file_names.map(file_name => {
            return this.findFile(file_name)
        })
    }
    findFile(search_key) {
        const fileIndex = Array.from(this.fileListObject).findIndex((elem) => {
            if (search_key.startsWith("."))
                return (elem.name.endsWith(search_key))
            return (elem.name === search_key);
        });
        if (fileIndex === -1) return -1
        return this.fileListObject[fileIndex];
    }
    fileReaderPromiseText =  function(file_result) {
        return new Promise((resolve, reject)=> {
            var fr = new FileReader();
            fr.onload = () => {
                resolve(fr.result)
            };
            fr.readAsText(file_result)
        })
    }
    fileReaderPromiseImage(file_result) {
        return new Promise((resolve, reject)=> {
            var fr = new FileReader();
            fr.onload = () => {
                resolve(fr.result)
            };
            fr.readAsDataURL(file_result)
        })
    }

    

}
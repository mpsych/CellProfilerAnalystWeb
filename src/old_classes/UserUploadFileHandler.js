export default class UserUploadFileHandler {

    constructor(fileListObject) {

        this.fileListObject = fileListObject
    }
    findAllFiles(file_names) {
        return file_names.map(file_name => {
            return this.findFile(file_name)
        })
    }
    findFile = (file_name) => {
        const fileIndex = Array.from(this.fileListObject.target.files).findIndex((elem) => {
            return (elem.name === file_name);
        });
        return this.fileListObject.target.files[fileIndex];
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
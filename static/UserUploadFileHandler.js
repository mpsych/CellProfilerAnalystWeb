class UserUploadFileHandler {
	constructor(fileListObject) {
		this.fileListObject = fileListObject;
	}
	findAllFiles(file_names) {
		return file_names.map((file_name) => {
			return this.findFile(file_name);
		});
	}
	findFile = (file_name) => {
		// console.log("looking for", file_name)
		const fileIndex = Array.from(this.fileListObject).findIndex((elem) => {
			return elem.name === file_name;
		});
		return this.fileListObject[fileIndex];
	};
	findFileWithExtension = (file_extension) => {
		for (let i = 0; i < this.fileListObject.length; i++) {
			const file = this.fileListObject[i];
			const fileName = file.name;
			if (fileName.endsWith(file_extension)) {
				return file;
			}
		}
		return null;
	};
	fileReaderPromiseText = async function (file_result) {
		return file_result.text();
	};
	fileReaderPromiseImage(file_result) {
		return new Promise((resolve, reject) => {
			var fr = new FileReader();
			fr.onload = () => {
				resolve(fr.result);
			};
			fr.readAsDataURL(file_result);
		});
	}
}

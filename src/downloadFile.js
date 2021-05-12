const downloadFile = (name, stringContent, extension) => {
	var file = {};
	var file_name = name;

	const element = document.createElement('a');
	if (extension.localeCompare('.csv') === 0) {
		file = new Blob([stringContent], { type: 'data:text/csv;charset=utf-8,' });
	}
	if (extension.localeCompare('.txt') === 0) {
		file = new Blob([stringContent], { type: 'plain/text' });
	}
	if (extension.localeCompare('.json')) {
		file = new Blob([stringContent], { type: 'application/JSON' });
	}
	element.href = URL.createObjectURL(file);
	element.download = file_name.concat(extension);
	document.body.appendChild(element); // Required for this to work in FireFox
	element.click();
};

export { downloadFile };

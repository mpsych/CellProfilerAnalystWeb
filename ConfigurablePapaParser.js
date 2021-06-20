self.importScripts('https://cdn.jsdelivr.net/npm/papaparse@5.3.0/papaparse.min.js');
class ConfigurablePapaParser {
	constructor(config) {
		this.config = config;
	}

	async papaparse(file, options, onEndMsg = null) {
		return new Promise(function (complete, error) {
			Papa.parse(file, { ...options, complete, error });
		}).then((result) => {
			if (onEndMsg) {
				console.log(onEndMsg);
			}
			return result.data;
		});
	}

	async dataFromCSVFile(file) {
		return this.papaparse(file, this.config);
	}
}

self.importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
/*
    @param {Array<Array<number>>>} dataArrays The 2D array of data of feature columns and row entries
    @param {Array<(0|1)>} labels The array of 0s and 1s corresponding to negative and positive labels
    @param {Array<int>} featureIndices The array of indices which correspond to columns to train on
    @param {int} batchSize The number of data samples per training batch
*/
self.createDatasetFromDataArrays = function (dataArrays, labels, featureIndices, batchSize) {
	// console.log("create dataset from array")
	const X = dataArrays.map((dataRowArray) => featureIndices.map((index) => dataRowArray[index]));
	const normed_X = self.norm2DArray(X);
	// const normed_X = X
	// console.log(normed_X)
	const Y = self.labelsToOneHot(labels);
	// console.log(Y)
	const tf_dataset = self.createTensorflowDataset(normed_X, Y);

	return tf_dataset.batch(batchSize);
};

/*
    @param {Array<Array<number>>} dataArrays 
        The 2D Array of data with feature columns and row entries to draw data from to predict on
    @param {Array<int>} featureIndices 
        The Array of indices from dataArrays to predict on
    @return {Tensor<Tensor<number>>} normed_X_tf 
        The 2D Tensor of numbers to predict on
*/
self.createTestset = function (dataArrays, featureIndices) {
	const X = dataArrays.map((dataRowArray) => featureIndices.map((index) => dataRowArray[index]));
	const normed_X = self.norm2DArray(X);
	return tf.tensor(normed_X);
};

/*
    @param  {Tensor<number>} X The training inputs for the dataset
    @param  {Tensor<Tensor<number>>} Y The training desired outputs for the dataset
    @return {tf.data.Dataset} tf_dataset The dataset object TensorFlow uses for training
*/
self.createTensorflowDataset = function (X, Y) {
	const tf_dataset = tf.data
		.zip({ xs: tf.data.array(X), ys: tf.data.array(Y) })
		.shuffle(X.length, Date.now() % 100000);
	return tf_dataset;
};

/*
    @param {Array<(0|1)>} predictions The labels that were predicted
    @param {Array<(0|1)>} ground_truth The labels that were expected
    @return {[[int, int],[int,int]]} confusion_matrix 
        The 2x2 confusion matrix of values where first is positive and second is negative
*/
self.createConfusionMatrix = (predictions, ground_truth) => {
	var confusion_matrix = [
		[0, 0],
		[0, 0],
	];
	for (var i = 0; i < predictions.length; i++) {
		// negative
		if (ground_truth[i] === 0) {
			// negative
			if (predictions[i] === 0) {
				confusion_matrix[1][1]++;
			}
			// positive
			else {
				confusion_matrix[0][1]++;
			}
		}
		// positive
		else {
			// negative
			if (predictions[i] === 0) {
				confusion_matrix[1][0]++;
			}
			//positive
			else {
				confusion_matrix[0][0]++;
			}
		}
	}
	return confusion_matrix;
};

/*
    @param  {Array<Array<number>>} array A 2D array of numbers
    @return {Array<Array<number>>} normed_array The array of numbers normalized along the columns by
                                                subtracting the column mean and dividing by the
                                                column standard deviation
*/
self.norm2DArray = function (array) {
	const length = array.length;
	const numFeatures = array[0].length;

	var means_array = new Array(numFeatures).fill(0);
	for (var j = 0; j < numFeatures; j++) {
		var sum = 0;
		for (var i = 0; i < length; i++) {
			sum += array[i][j];
		}
		means_array[j] = sum / length;
	}

	var stddevs_array = new Array(numFeatures).fill(0);

	for (var j = 0; j < numFeatures; j++) {
		var sum_squares = 0;
		for (var i = 0; i < length; i++) {
			sum_squares += Math.pow(array[i][j], 2);
		}
		stddevs_array[j] = Math.sqrt(sum_squares / length - Math.pow(means_array[j], 2));
	}

	const normed_array = array.map((data_row) => {
		return data_row.map((value, idx) => {
			if (stddevs_array[idx] === 0) {
				return 0;
			}
			return (value - means_array[idx]) / stddevs_array[idx];
		});
	});

	return normed_array;
};

/*
    @param  {Array<0|1>} labels A list of 0s and 1s corresponding to a 
                                classification of negative and positive respectively
    @return {Tensor<Tensor<number>>} oneHotForm The Tensor One-Hot form of the labels
*/
self.labelsToOneHot = function (labels) {
	const oneHotForm = labels.map((label) => {
		const outcome = label === undefined ? 0 : label;
		return Array.from(tf.oneHot(outcome, 2).dataSync());
	});
	return oneHotForm;
};

self.fitBetaDistribution = function (counts) {
	const tensorCounts = tf.tensor(counts);
	var counter = 0;
	// careful named arguments are still positional
	const N = tensorCounts.sum((axis = 1), (keepDims = true));
	var alphas = tensorCounts
		.sum((axis = 0))
		.div(tensorCounts.sum())
		.add(tf.scalar(0.1));
	while (true) {
		counter++;
		// const sum1 = tensorCounts.mul(tf.log(tensorCounts.sub(1).add(alphas))).sum();

		// const sum2 = N.mul(tf.log(N.sub(1).add(alphas.sum()))).sum();

		// const log_liklihood = sum1.sub(sum2);

		const numerator = tensorCounts.div(tensorCounts.sub(1).add(alphas)).sum((axis = 0));

		const denominator = N.div(N.sub(1).add(alphas.sum())).sum((axis = 0));

		const new_alphas = alphas.mul(numerator).div(denominator);

		const delta = tf.abs(new_alphas.sub(alphas).sum());

		if (delta.arraySync() < 0.0001) {
			// console.log(new_alphas.arraySync());
			return new_alphas.arraySync();
		}

		alphas = new_alphas;
	}
};

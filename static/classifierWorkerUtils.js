

/*
    @param {Array<Array<number>>>} dataArrays The 2D array of data of feature columns and row entries
    @param {Array<(0|1)>} labels The array of 0s and 1s corresponding to negative and positive labels
    @param {Array<int>} featureIndices The array of indices which correspond to columns to train on
    @param {int} batchSize The number of data samples per training batch
*/
self.createDatasetFromDataArrays = function(dataArrays, labels, featureIndices, batchSize) {
    console.log("create dataset from array")
    const X = dataArrays.map(dataRowArray =>
        featureIndices.map((index)=>dataRowArray[index])
    )
    const normed_X = norm2DArray(X)

    const Y = labelsToOneHot(labels)

    const tf_dataset = createTensorflowDataset(normed_X, Y)

    return tf_dataset.batch(batchSize);
} 






/*
    @param  {Array<Array<number>>} array A 2D array of numbers
    @return {Array<Array<number>>} normed_array The array of numbers normalized along the columns by
                                                subtracting the column mean and dividing by the
                                                column standard deviation
*/
self.norm2DArray = function(array) {

    var means_array = new Array(array[0].length).fill(0)
    for (var j = 0; j < array[0].length; j++) {
        var sum = new Array(array[0].length).fill(0)
        for (var i = 0; i < array.length; i++) {
            sum[j] += array[i][j]
        }
        means_array[j] = sum[j]/array[0].length
    }


    var stddevs_array = new Array(array[0].length).fill(0)

    for (var j = 0; j < array[0].length; j++) {
        var sum_squares = new Array(array[0].length).fill(0)
        for (var i = 0; i <array.length; i++) {
            sum_squares[j] += Math.pow((array[i][j] - means_array[j]),2)
        }
        stddevs_array[j] = Math.sqrt(sum_squares[j])
    }


    const normed_array = array.map(data_row => 
        {
            return data_row.map( (value, idx) => (value - means_array[idx])/stddevs_array[idx])
        }
    )

    return normed_array;

}
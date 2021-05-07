//import React from 'react'

// class fit_beta_binomial {

//   constructor(counts){
//     // input should be N x 2 array
//     var assert = require('assert')
//     assert(counts[0].constructor === Array)

//     this.counts = counts
//   }

  //function to sum all elements in array
  function arrSum(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
      if (typeof arr[i] == 'object')
        sum += arrSum(arr[i]);
      else
        sum += arr[i];
    }
    //console.log(sum)
    return sum;
  }

  //function for array addition found online
  function sumArray(a, b) {
    var c = [];
    for (var i = 0; i < Math.max(a.length, b.length); i++) {
      c.push((a[i] || 0) + (b[i] || 0));
    }
    return c;
  }


  function fit_beta (counts) {
    
    var log_liklihood = 0

    //counts - 1
    var counts_one = []

    var counts_one_plus_alphas = []

    // looping outer array elements
    for(let i = 0; i < counts.length; i++){

    // get the length of the inner array elements
    let innerArrayLength = counts[i].length;
    let ret = []
    // looping inner array elements
      for(let j = 0; j < innerArrayLength; j++) {
        ret.push(counts[i][j] - 1)
        if(j === innerArrayLength - 1){
          counts_one.push(ret) 
        }
      }
    }

    

    //sum of rows = array.sum(axis=1)
    var N = counts.map(r => r.reduce((a, b) => a + b));
    console.log(N)
    //sum of columns, array.sum(axis=0)
    var alph = counts.reduce((a, b) => a.map((x, i) => x + b[i]))
    //first guess for alpha
    const alpha = []
    alph.forEach(element => alpha.push((element/arrSum(counts)) +0.1))
    console.log(alpha)

    // counts - 1 + alphas
    for(var i = 0; i < counts_one.length; i++){
      counts_one_plus_alphas.push(sumArray(counts_one[i], alpha))
    }

    //console.log(counts_one_plus_alphas)

    //np.log(counts - 1 + alphas)
    // looping outer array elements
    for(let i = 0; i < counts_one_plus_alphas.length; i++){

      // get the length of the inner array elements
      let innerArrayLength = counts_one_plus_alphas[i].length;
    
      // looping inner array elements
        for(let j = 0; j < innerArrayLength; j++) {
          //counts_one_plus_alphas[i][j] =  Math.log(counts_one_plus_alphas[i][j])
         
          //(counts * np.log(counts - 1 + alphas)
          counts_one_plus_alphas[i][j] =  Math.log(counts_one_plus_alphas[i][j]) * counts[i][j]
        }
      }

    //console.log(counts_one_plus_alphas)

    //((counts * np.log(counts - 1 + alphas)).sum() 
    const sum1 = arrSum(counts_one_plus_alphas)

    //(N - 1 + alphas.sum())
    for(var i = 0; i < N.length; i++){
      N[i] = Math.log((N[i] - 1) + arrSum(alpha)) * N[i]
    }

    //console.log(N)

    const sum2 = arrSum(N)

    //((counts * np.log(counts - 1 + alphas)).sum() - (N * np.log(N - 1 + alphas.sum())).sum())
    log_liklihood = sum1 - sum2

    console.log(log_liklihood)
    // while(true){
      
    // }

  }

  const ar = [[1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5, 6]]
  fit_beta(ar)

//}

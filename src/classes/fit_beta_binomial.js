const { sum } = require('@tensorflow/tfjs');
const tf = require('@tensorflow/tfjs');

function fit_beta (counts) {
  tensorCounts = tf.tensor(counts)
  //tensorCounts.print()
  var N = tensorCounts.sum(axis=1, keepDims = true)
  //console.log(N.print())

  var alphas =  (tensorCounts.sum(axis=0).div(tensorCounts.sum())).add(tf.scalar(0.1))
  //console.log(alphas.print())

   //while(true){

       //((counts * np.log(counts - 1 + alphas)).sum() 
       var sum1 = (tensorCounts.mul(tf.log(tensorCounts.sub(1).add(alphas)))).sum()
       //sum1.print()
       //(N * np.log(N - 1 + alphas.sum())).sum())
       var sum2 = (N.mul(tf.log(N.sub(1).add(alphas.sum())))).sum()
       //sum2.print()
       var log_liklihood = sum1 - sum2
       console.log("log_liklihood")
       console.log(log_liklihood)

       var numerator = (tensorCounts.div(tensorCounts.sub(1).add(alphas))).sum(axis=0)
       numerator.print()

       //denominator = (N / (N - 1 + alphas.sum())).sum(axis=0)
       var denominator = (N.div(N.sub(1).add(alphas.sum()))).sum(axis=0)
       denominator.print()
       //new_alphas = alphas * numerator / denominator
       var new_alphas = alphas.mul(numerator).div(denominator)

       new_alphas.print()

       //delta = abs(new_alphas - alphas).sum()
       var delta = tf.abs(new_alphas.sub(alphas).sum())
       delta.print()
       if(delta < 0.0001){
           return new_alphas
       }

       alphas = new_alphas
       alphas.print()
   //}
  
}

const ar = [[1, 2], [2, 3], [3, 4], [4, 5]]
fit_beta(ar)
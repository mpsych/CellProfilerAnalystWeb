<p align="center">
  <a href="https://yahtzeerage.github.io/CellProfilerAnalystForTheWeb/static/cpa_logo(blue)-fe2e956042094f68a0afbe23f4755b43.png">
    <img alt="Gatsby" height=200 width=900 src="https://yahtzeerage.github.io/CellProfilerAnalystForTheWeb/static/cpa_logo(blue)-fe2e956042094f68a0afbe23f4755b43.png" width="60" />
  </a>
</p>


## 🚀 Quick start to use source code

You could navigate to the website, but if you don't want to:

1.  clone the repo

2.  **Install dependencies.**

    Navigate into your new site’s directory and start it up.

    ```shell
    yarn install
    ```

3.  **Start the App!**

    ```shell
    yarn start
    ```
    Your site is now running at http://localhost:8000!

4.  **Start Analyzing!**
    
    [Download the Example ZIP file](http://d1zymp9ayga15t.cloudfront.net/content/Examplezips/cpa_2.0_example.zip)
    [It come's from here](https://github.com/CellProfiler/CellProfiler-Analyst)

    Unzip the file, and press the upload button in the app and upload the folder. Once uploading and initial training is complete, you can now:
    * Fetch images (Random, Positive, Negative, By Image, Training Set Positive/Negative, Confusing)
    * Train on images dragged from Unclassified into Positive and Negative grids
    * Evaluate (look at the confusion matrix on the training set)
    * Score All (calculate the enrichment scores with Empirical Bayes and look at/download the data)
    * Download the model spec and its corresponding weights files

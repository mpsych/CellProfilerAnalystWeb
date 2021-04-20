import React from 'react'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Papa from 'papaparse'
import * as tf from '@tensorflow/tfjs'

import jones from '../jones.jpg'

export default class ProofOfConcept extends React.Component {

    constructor(){
        super();

        // console.log(normal([[1,2],
        //                     [3,5]]))
        // console.log(center([[1,2],
        //                     [3,20]]))
        // console.log(level([[1,2],
        //                    [3,5],
        //                    [7,9]]))
        Papa.parsePromise = function(file, config) {
            return new Promise(function(complete, error) {
              Papa.parse(file, {...config, complete, error});
            });
        };

        Promise.prototype.notify = function(strMsg) {
            return this.then(x=>{console.log(strMsg); return x});
        }
        Promise.prototype.debugPrint = function() {
            return this.then(x=>{console.log(x); return x});
        }

        Array.prototype.sliceByValue = function (value1, value2) {
            const index1 = this.indexOf(value1);
            const index2 = this.indexOf(value2);

            if (value1 === -1 || value2 === -1) {
                console.error("Values not found to slice");
                return null;
            }
        
            return this.slice(index1, index2);
        }

        

        this.basicPapaConfig = {
            worker: true,
            skipEmptyLines: true,
            dynamicTyping: true
        }
    }
    
    state = {
        imageSources: new Array(9).fill(jones),
        buttonsDisabled: true
    }

    handleUpdate = newData =>
    {
        this.setState(prevState => ({
      data: { ...prevState.data, ...newData }
    }))};

    // modified from emma.js  
    findFileIndex (fileListObject, fileName) {
        var index = Array.from(fileListObject.target.files).findIndex((elem) => {
            return elem.name === fileName;
        });
        return index;
    }


    fileReaderPromiseImage(fileListObject, fileIndex) {
        return new Promise((resolve, reject)=> {
            var fr = new FileReader();
            fr.onload = () => {
                resolve(fr.result)
            };
            fr.readAsDataURL(fileListObject.target.files[fileIndex])
        })
    }

    fileReaderPromiseText(fileListObject, fileIndex) {
        return new Promise((resolve, reject)=> {
            var fr = new FileReader();
            fr.onload = () => {
                resolve(fr.result)
            };
            fr.readAsText(fileListObject.target.files[fileIndex])
        })
    }

    on_model_uploaded_callback = async function(fileListObject) {
        

        
        return new Promise(async resolve => {

            this.model = tf.sequential();
            this.model.add(
                tf.layers.dense({
                units: 2,
                activation: "softmax",
                inputShape: [616]
                })
            );
            const optimizer = tf.train.adam(0.001);
            // this.model = await tf.loadLayersModel(tf.io.browserFiles(
            //     [fileListObject.target.files[0]]));
    
            this.model.compile({optimizer: optimizer, loss: 'binaryCrossentropy', metrics: ["accuracy"]});

            this.model.fit(this.standardized_features, this.label, {
                epochs: 500, callbacks: {onEpochBegin: ()=>console.log("start epoch"),
                                         onEpochEnd:async (epoch, logs)=>console.log("Epoch:" + epoch + " Loss:" + logs.loss)}
            }).then(()=>{
                let prediction = this.model.predict(this.standardized_features);this.model.summary()

                prediction.data().then((data_array) => {
                    console.log(data_array);
                    
                });
                resolve('resolved');
                prediction.dispose();  
            })
            
            
            
        })

        // console.log(fileListObject.target.files[0])
        // const model = await tf.loadLayersModel(
        //     tf.io.browserFiles([fileListObject.target.files[0], null]));
        // model.summary();

        // testing tensorflow
        
        
        {
            const model = await tf.loadLayersModel(tf.io.browserFiles(
                [fileListObject.target.files[0]]));
            // console.log(model.summary());

            // model.fit(this.standardized_features, this.label);
            // model.summary()
            // console.log(model.summary())

            model.compile({optimizer: 'sgd', loss: 'categoricalCrossentropy'});
            model.fit(this.standardized_features, this.label)
            .then(()=>{model.predict(this.standardized_features);model.summary()});
            
            // console.log(model.summary())
            // console.log()
        }
    }


    on_folder_uploaded_callback = async function(fileListObject) {

        console.log("folder upload done!")


    

        await Promise.all(Array.from({length: 9}, (_,idx)=>
        // the 6th item is an image and a lot of items after are images, obviously we need a better implementation lol
            this.fileReaderPromiseImage(fileListObject, idx+6).then(img_data=>{
                // this.state.imageSources[idx] = img_data;

                // promise to turn the base64 data returned by the fileReaderPromiseImage into a proper Image object
                new Promise(resolve => {
                    const img = new Image();
                    img.onload = () => {
                        // return the image to .then() once it has been loaded from the src
                        resolve(img);
                    }
                    img.src = img_data;
                })
                .then(img => {
                    // for a test, let's turn the Image object into a tensor
                    const img_tensor = tf.browser.fromPixels(img)
                    // let's grab the canvas at the index and create a temporary canvas to store tensorflow image
                    var canvas_at_index = document.getElementById(`canvas: ${idx}`);
                    // thing that draws on canvas
                    var ctx_at_index = canvas_at_index.getContext("2d");
                    var temp_canvas = document.createElement('canvas');
                    
                    // alright this promise will resolve when canvas is loaded with the tensorflow image
                    tf.browser.toPixels(img_tensor, temp_canvas).then(()=>{
                        ctx_at_index.drawImage(temp_canvas, 0, 0, canvas_at_index.width, canvas_at_index.height)
                        temp_canvas.remove();
                    })     
                })
                

                

                
            }
        )))
        .then(()=>console.log("Finished Loading Images"))

        
        const object_csv_index = this.findFileIndex(fileListObject, "per_object.csv");
        const image_csv_index = this.findFileIndex(fileListObject, "per_image.csv");
        const setup_sql_index = this.findFileIndex(fileListObject, "example_SETUP.SQL");
        const training_data_index = this.findFileIndex(fileListObject, "MyTrainingSet.txt");

        
        


        

        await Promise.all([
            Papa.parsePromise(fileListObject.target.files[object_csv_index],
                {...this.basicPapaConfig, fastMode: true,} // luckily it has no quotes so we can use fastmode
            )
            .then((result)=> result.data)
            .notify("Finished Loading Object Data"),


            Papa.parsePromise(fileListObject.target.files[image_csv_index],
                this.basicPapaConfig
            )
            .then((result)=> result.data)
            .notify("Finished Loading Image Data"),


            Papa.parsePromise(fileListObject.target.files[setup_sql_index],
                {...this.basicPapaConfig, delimiter: ',' }    
            )
            .then((result)=> result.data.map(e=>e[0].trim()))
            .notify("Finished Loading Setup Data"),


            Papa.parsePromise(fileListObject.target.files[training_data_index],
                {...this.basicPapaConfig, delimiter: " ", comments: "#" }
            )
            .then((result)=>result.data.slice(1)) 
            .notify("Finished Loading Training Data")
        ])
        .then(values =>{
            [this.object_data, this.image_data, this.setup_lines, this.training_data] = values;
        })
        
        console.log(this.object_data, this.image_data, this.setup_lines, this.training_data)
        window.object_data = this.object_data
        window.image_data = this.image_data
        window.setup_lines = this.setup_lines
        window.training_data = this.training_data


        this.object_column_lines = this.setup_lines.sliceByValue(
            "CREATE TABLE per_object (", 
            "PRIMARY KEY  (ImageNumber,ObjectNumber)"
        );
        this.object_column_names = this.object_column_lines.map((name)=>name.split(' ')[0]);
        console.log(this.object_column_names)

        this.image_column_lines = this.setup_lines.sliceByValue(
            "CREATE TABLE per_image (", 
            "PRIMARY KEY  (ImageNumber)"
        );
        this.image_column_names = this.image_column_lines.map((name)=>name.split(' ')[0]);


        this.labeled_cells = this.training_data.map(training_row=>{
            return this.object_data.find((data_row)=>data_row[0] === training_row[1] && data_row[1] === training_row[2]);
        });
        this.training_data_column_names = "label imagenum objectnum x y".split(" ")



        this.object_features_to_use = this.object_column_lines.filter((elem)=>!elem.includes("Location"));
        this.object_features_to_use_indices = this.object_features_to_use.map((elem)=>this.object_column_lines.indexOf(elem));
        this.labeled_features = this.labeled_cells.map(row=>{
                return this.object_features_to_use_indices.map((idx)=>row[idx]);
        })

        const labeled_features_tensor = new tf.tensor2d(this.labeled_features);

        const labeled_features_tensor_std_dev = tf.moments(labeled_features_tensor, 0).variance.sqrt();

        const standardized_features_tensor = (labeled_features_tensor.sub(labeled_features_tensor.mean(0)).div(labeled_features_tensor_std_dev))
        
        this.standardized_features = await standardized_features_tensor.array();
        console.log(this.standardized_features)
        // const standardized_features_matrix = new Matrix(this.standardized_features)
        // const a = new tf.tensor2d();
        // a.print();
        
        // tf.batchNorm(a, a.mean(0), tf.moments(a, 0).variance).print();

        this.labels = [this.training_data.map((row)=> row[0]==='positive'? 1:0).slice(0,613)];
        console.log(this.labels);
        // const labels_matrix = new Matrix(this.labels);
        
        // this.classifier = new LogisticRegression({ numSteps: 10000, learningRate: 5e-2 });
        // this.classifier.train(standardized_features_matrix, labels_matrix);
        // console.log(this.classifier.predict(standardized_features_matrix))
        
        // console.log(this.image_column_names)
        
         
        this.setState({buttonsDisabled: false})

        // hack
        // this.on_model_uploaded_callback()
         
        

        
         

        

        
        

        // END OF THE TRUSTWORTHY CODE

        
        // this.object_features_to_use = this.object_column_lines.filter((elem)=>!elem.includes("Location"));
        // this.object_features_to_use_indices = this.object_features_to_use.map((elem)=>this.object_column_lines.indexOf(elem));
        // this.image_features_to_use = this.image_column_lines.filter((elem)=>!elem.includes("Location"));
        // this.image_features_to_use_indices = this.image_features_to_use.map((elem)=>this.image_column_lines.indexOf(elem));

        
        // this.labeled_features = this.labeled_cells.map(row=>{
        //     return this.object_features_to_use_indices.map((idx)=>row[idx]);
        // })

        // console.log(this.training_data.map((row)=> row[0]==='positive'? 1:0));
        // this.labels = new Matrix([this.training_data.map((row)=> row[0]==='positive'? 1:0).slice(0,613)]);

        // this.standardized_features = new Matrix(normal(this.labeled_features));

        // this.classifier = new LogisticRegression({ numSteps: 1000, learningRate: 5e-3 });


        // this.labeled_features_transpose = Array(this.labeled_features[0].length).fill(0).map(()=>{
        //     return new Array(this.labeled_features.length).fill(0);
        // }).slice(0,613);

        // console.log(this.labeled_features)
        // console.log(this.labeled_features_transpose);

        // for (var i = 0; i < this.labeled_features.length; i++){
        //     for (var j = 0; j < this.labeled_features[0].length; j++) {
        //         this.labeled_features_transpose[j][i] = this.labeled_features[i][j];
        //     }
        // }

        // console.log(this.labeled_features_transpose);
        // console.log(normal(this.labeled_features_transpose));


        // this.meaned_features_transposed = this.labeled_features_transpose.map(row=> {
        //     const row_mean = row.reduce((acc, curr)=> acc+curr, 0)/row.length;
        //     return row.map(element=>element - row_mean);
        // });

        // this.standardized_features_transposed = this.meaned_features_transposed.map(row=> {
        //     const row_std = Math.sqrt(row.reduce((acc, curr)=>acc+curr**2, 0));
        //     return row.map(element=>element/row_std);
        // });

        // console.log(this.standardized_features_transposed);

        // console.log(this.labels);
        // this.classifier.train(this.standardized_features_transposed, this.labels);
        // // console.log(this.labeled_features);
        // // console.log(center(this.labeled_features))
        // // console.log(center(this.labeled_features).reduce((acc, cur)=>acc+cur[0], 0))
        // // window.labeled_features = this.labeled_features;
        // // window.centered_labeled_features = center(this.labeled_features);
        // // console.log(normal(center(this.labeled_features)))
        // // console.log(new Matrix(this.labeled_features));
        // // console.log(this.standardized_features)
        // console.log(this.classifier.predict(this.standardized_features));


    
    }
    
    on_fetch_button_callback() {
        const SAMPLES_NEEDED = 9;
        const SAMPLES_PER_PREDICT = 20;
        var sample_count = 0;

        var data_samples = [];
        console.log("fetching...");

        // while (sample_count < 9) {
        //     const randDataIndices = Array(SAMPLES_PER_PREDICT).fill(0).map(()=>Math.floor(Math.random() * this.object_data.length));
        //     const cell_features = randDataIndices.map((data_idx)=>this.object_features_to_use_indices.map((feature_idx)=>this.object_data[data_idx][feature_idx]));
        //     // const predicted_labels = this.classifier.predict(new Matrix(normal(cell_features)))
        //     // console.log(predicted_labels);

        //     // const positive_cells = predicted_labels.filter(x=>x===1);
        //     // if (positive_cells.length > 0) {
        //     //     data_samples.concat(positive_cells);
        //     //     if (data_samples.length >= SAMPLES_NEEDED) {
        //     //         console.log(data_samples);
        //     //         return;
        //     //     }             
        //     // }
        //     console.log("found no positive cells, looping...")
        // }
    }

    componentDidMount(){

    };
    componentWillUnmount(){};

    handleUpdate = newData =>
    this.setState(prevState => ({
      data: { ...prevState.data, ...newData }
    }));

    render(){


        // const a = new tf.tensor2d([[1,1000, 300],[110,222, 600], [110,222, 600]]);
        // a.print();
        // const mean = a.mean(0)
        // const std_dev = tf.moments(a,0).variance.sqrt()
        // (a.sub(mean).div(std_dev)).print();
        // // tf.batchNorm(a, a.mean(0), tf.moments(a, 0).variance).print();

        // JSX goes here:
        
        return (<div>

                
            

            <Grid container justify="center" spacing={2} style={{ backgroundColor: '#cfe8fc'}}>
                <Grid key={0} item>
                    <Button disabled={this.state.buttonsDisabled} variant="contained"
                            onClick={()=>{console.log("Fetch!");this.on_fetch_button_callback();}}>Fetch</Button>
                </Grid>

                <Grid key={1} item>
                    <Button disabled={this.state.buttonsDisabled} variant="contained"
                            onClick={()=>console.log("Train!")}>Train</Button>
                </Grid>

                <Grid key={2} item>
                    <Button disabled={this.state.buttonsDisabled} variant="contained"
                            onClick={()=>console.log("Evaluate!")}>Evaluate</Button>    
                </Grid>

                <Grid key={3} item>
                    <Button variant="contained" component="label"
                            onClick={()=>console.log("Upload Folder!")}>
                        Upload Data
                        <input  type="file" 
                                hidden webkitdirectory="true" 
                                mozdirectory="true" 
                                msdirectory="true" 
                                odirectory="true" 
                                directory="true" 
                                multiple 
                                onChange = {(fileName) => this.on_folder_uploaded_callback(fileName)}
                                />
                    </Button>    
                </Grid>

                <Grid key={4} item>
                    <Button disabled={this.state.buttonsDisabled} variant="contained" component="label"
                            onClick={()=>console.log("Upload Model!")}>
                        Upload Model
                        <input  type="file" 
                                // hidden webkitdirectory="true" 
                                // mozdirectory="true" 
                                // msdirectory="true" 
                                // odirectory="true" 
                                // directory="true" 
                                // multiple 
                                onChange = {(fileName) => this.on_model_uploaded_callback(fileName)}
                                />
                    </Button>    
                </Grid>

                <Grid key={5} item>
                    
                    <Button disabled={this.state.buttonsDisabled} variant="contained"  component="label" onClick={()=>console.log("Download!")}>     
                        <a style={{color: 'black', textDecoration: 'none'}} href={jones} download="jones.jpg">        
                        Download
                        </a>
                    </Button>

                </Grid>
            </Grid>

            <Container  maxWidth="xs" spacing={0}> 
            
               
            
                <GridList cellHeight="auto" cols={3}>
                    {[0,1,2,3,4,5,6,7,8].map((tile_idx) => (
                    <GridListTile key={tile_idx} cols={ 1} spacing={0}>
                        <Button  onClick={()=>console.log(`Click Image: ${tile_idx}!`)}>
                            {/* <img  width={'100%'} src={this.state.imageSources[tile_idx]} alt={"jones"} /> */}
                            <canvas color="black" height="100%" width="100%" id={`canvas: ${tile_idx}`}></canvas>
                        </Button>
                    </GridListTile>
                    ))}
                </GridList>
            </Container>
        </div>)
    };
}
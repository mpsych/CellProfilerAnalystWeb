import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import ReactDOM from "react-dom";
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  swap,
  move
} from "react-grid-dnd";

import "../dndstyles.css";
import { unregisterKernel } from '@tensorflow/tfjs';

import { Row} from "reactstrap";




function BelladndTest() {

    //function getURL(){
        // for (i = 0; i < urls.length; i++)  
         // urlRandom = urls[Math.floor(Math.random()*urls.length)]
        
            
   // }

   var urls = [
    "https://i.postimg.cc/SNBRqKqX/cell-image1.jpg",
    "https://i.postimg.cc/3JvrLHp3/cell-image10.jpg",
    "https://i.postimg.cc/XY6jmDcd/cell-image11.jpg",
    "https://i.postimg.cc/XYKjbcQh/cell-image12.jpg",
    "https://i.postimg.cc/25zz8bt5/cell-image13.jpg",
    "https://i.postimg.cc/cJXdK1qB/cell-image14.jpg",
    "https://i.postimg.cc/hjvcVFcW/cell-image15.jpg",
    "https://i.postimg.cc/SsPqrZxX/cell-image16.jpg",
    "https://i.postimg.cc/cC8W5QvF/cell-image17.jpg",
    "https://i.postimg.cc/bdcPXsbp/cell-image18.jpg",
    "https://i.postimg.cc/1RgNZ26j/cell-image19.jpg",
    "https://i.postimg.cc/nhqzLtc3/cell-image2.jpg",
    "https://i.postimg.cc/xjWNj53T/cell-image20.jpg",
    "https://i.postimg.cc/yNBNgrDs/cell-image3.jpg",
    "https://i.postimg.cc/7LVZgMz7/cell-image4.jpg",
    "https://i.postimg.cc/vBZHXg7K/cell-image5.jpg",
    "https://i.postimg.cc/3Nyr5scC/cell-image6.jpg",
    "https://i.postimg.cc/Zn1bTfkk/cell-image7.jpg",
    "https://i.postimg.cc/0QX54kcy/cell-image8.jpg",
    "https://i.postimg.cc/tRfCtgsr/cell-image9.jpg"

   ];

    function test() {
          return { unclassifed: [
                { id: 1 , address: urls[0]},
                { id: 2, address: urls[1]},
                { id: 3 , address:urls[2]},
                { id: 4, address: urls[3] },
                { id: 5 , address: urls[4]},
                { id: 6 , address: urls[5]}, 
                { id: 7 , address: urls[6]}, 
                { id: 8, address: urls[7] }, 
                { id: 9 , address: urls[8]}, 
                { id: 10, address:urls[9] }, 
                { id: 11, address:urls[10] }, 
                { id: 12, address:urls[11] }, 
                { id: 13 , address:urls[12]}, 
                { id: 14, address:urls[13] }, 
                { id: 15, address:urls[14]}, 
                { id: 16, address:urls[15] }, 
                { id: 17, address:urls[16] }, 
                { id: 18, address:urls[17] }, 
                { id: 19, address:urls[18] }, 
                { id: 20, address:urls[19]}, 
              ],
            positive: [
             
            ],
            negative: [
            
            ]};
    }
  

   
    const [items, setItems] = React.useState(
        //{ 
        // unclassifed: [
        //     { id: 1 , address: urls[0]},
        //     { id: 2, address: urls[1]},
        //     { id: 3 , address:urls[2]},
        //     { id: 4, address: urls[3] },
        //     { id: 5 , address: urls[4]},
        //     { id: 6 , address: urls[5]}, 
        //     { id: 7 , address: urls[6]}, 
        //     { id: 8, address: urls[7] }, 
        //     { id: 9 , address: urls[8]}, 
        //     { id: 10, address:urls[9] }, 
        //     { id: 11, address:urls[10] }, 
        //     { id: 12, address:urls[11] }, 
        //     { id: 13 , address:urls[12]}, 
        //     { id: 14, address:urls[13] }, 
        //     { id: 15, address:urls[14]}, 
        //     { id: 16, address:urls[15] }, 
        //     { id: 17, address:urls[16] }, 
        //     { id: 18, address:urls[17] }, 
        //     { id: 19, address:urls[18] }, 
        //     { id: 20, address:urls[19]}, 
        //   ],
        // positive: [
         
        // ],
        // negative: [
        
        // ]

        test()

      //}
      );

    
     
      function onChange(sourceId, sourceIndex, targetIndex, targetId) {
        if (targetId) {
          const result = move(
            items[sourceId],
            items[targetId],
            sourceIndex,
            targetIndex
          );
          return setItems({
            ...items,
            [sourceId]: result[0],
            [targetId]: result[1]
          });
        }
    
        const result = swap(items[sourceId], sourceIndex, targetIndex);
        return setItems({
          ...items,
          [sourceId]: result
        });
      }
 
    return( 
   
  
    
    <GridContextProvider onChange={onChange}>
        <div>
        
        <p style = {{textAlign:"left", backgroundColor: 'white', paddingLeft: "10%", marginBottom: 0} }>Unclassified</p>
        
        <div className="topContainer">
       
        <GridDropZone
             className="dropzone "
            id="unclassifed"
            boxesPerRow={8}
            rowHeight={70}
          >
             
            {items.unclassifed.map(item => (
              <GridItem key={item.id}>
                <div className="grid-item" >
                    <div className="grid-item-content" style = {{backgroundImage:  `url(${item.address})`}} >
                        
                        </div> 
                </div>
              </GridItem>
            ))}
          </GridDropZone>
          </div>
        
        <Row>
          <label style = {{textAlign:"left", backgroundColor: 'white', paddingLeft: "11%"} }>Positive</label> 

          <label style = {{textAlign:"left", backgroundColor: 'white', paddingLeft: "34.5%", marginBottom: 0} }>Negative</label>
          </Row>
         
         <Row>

          <GridDropZone
            className="dropzone positive"
            id="positive"
            boxesPerRow={4}
            rowHeight={70}
          >
            
            {items.positive.map(item => (
              <GridItem key={item.id}>
                <div className="grid-item"> 
                    <div className="grid-item-content" style = {{backgroundImage: `url(${item.address})`}}>
                         
                        </div>  
                </div>
              </GridItem>
            ))}
          </GridDropZone>
   
      
          <GridDropZone
            className="dropzone negative"
            id="negative"
            boxesPerRow={4}
            rowHeight={70}
          >
            {items.negative.map(item => (
              <GridItem key={item.id}>
                <div className="grid-item">
                <div className="grid-item-content" style = {{backgroundImage: `url(${item.address})`}}>
                        
                        </div>      
                </div>
              </GridItem>
            ))}
          </GridDropZone>

     
      
        </Row>
        </div>
      </GridContextProvider>
    );

    }


export default BelladndTest; 





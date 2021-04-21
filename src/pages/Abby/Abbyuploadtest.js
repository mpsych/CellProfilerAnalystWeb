import React, {useState} from 'react'
import  BeatLoader from 'react-spinners'
import Button from '@material-ui/core/Button';


// export default function Loading() {

//     return (
//         <div>
            
//             <BeatLoader></BeatLoader>
            
//         </div>
//     )

// }
export default function Spinner(){
    const [isLoading, setLoading] = useState()

    const fetchData = () => {
        setLoading(true);
        setTimeout(() => {
           setLoading(false); 
        }, 1500)
    } 
    return (
        <div>
            <header>
               {isLoading ? "" : (<Button variant = "contained" color = "primary" onClick = {fetchData}>Click to upload</Button>)} 
               {isLoading ? <div><h4>Loading...</h4>
               <BeatLoader></BeatLoader>  </div> : ""}
            </header>
        </div>
    )
}

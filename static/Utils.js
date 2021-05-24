    /*  @param keysOuter = outer most keys
        @param keysInner = inner most keys
        @param values = values
    */  
function obj_obj_array(keysOuter, keysInner, values) {
    var obj = {}
    for (var i = 0; i < keysOuter.length; i++) {
        obj[keysOuter[i]] = {}
        if (!Array.isArray(keysOuter[i])) {
            obj[keysOuter[i]][keysInner[i]] = values[i]
            continue;
        }
        else {
            obj[keysOuter[i]] = keysInner[i].map(function(key, j) {
                return [key, values[j]]
            })
            }
        }
    return obj;
}
//export {obj_obj_array}

function sliceArrayByValue(array, value1, value2) {
    const index1 = array.indexOf(value1);
    const index2 = array.indexOf(value2);
  
    if (value1 === -1 || value2 === -1) {
        console.error("Values not found to slice");
        return null;
    }
  
    return array.slice(index1, index2);
  }
//export {sliceArrayByValue}

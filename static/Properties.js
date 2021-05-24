class Properties {
    constructor() {
        this.all_prop_keys = [['db_sql_file'],['image_table', 'object_table'], ['training_set'],
                       ['image_id', 'object_id', 'plate_id', 'well_id', 'cell_x_loc',
                       'cell_y_loc'], ['image_channel_paths', 'image_channel_files', 'image_channel_names',
                       'image_channel_colors'] ,['classifier_ignore_columns'], ['object_name', 'plate_type'], ['image_tile_size']]
        this. prop_types = ['setup', 'data_file_props', 'training_file_props', 'column_props', 'image_props', 'classifier_props'
                            ,'meta', 'tile_size' ]
        this.props = {}
    }
    /*  
        default properties (work in progress)
    */  
    // setupDefualt() {
    //     var default_values = [".SQL",["per_image.csv", "per_object.csv"],["ImageNumber", "ObjectNumber", 
    //     "plate", "well", "Nuclei_Location_CenterX", "Nuclei_Location_CenterY"],
    //      [["Image_PathNames_Path_OrigActin", "Image_PathNames_Path_OrigDNA", "Image_PathNames_Path_OrigpH3"],
    //      ["Image_FileNames_Filename_OrigActin", "Image_FileNames_Filename_OrigpH3", "Image_FileNames_Filename_OrigDNA"],
    //      ["Actin", "pH3", "DNA"], ["red", "green", "blue"]],[["cell", "cells", 'ObjectNumber', 'ImageNumber'], '96'],[["Nuclei_Location.*", "Meta.*"],
    //      ".txt"],"40"]

    //      this.props = obj_obj_array(this.prop_types, this.all_prop_keys, defualt_values);

    // }

    /*  @param {text}
           properties file string parsed from .properties file for initializing program properties
           gotten from uploadHandler
    */  
    init(text) {
        for (var i = 0; i < this.all_prop_keys.length; i++) {
            this.props[this.prop_types[i]] = {}
            for (var j = 0; j < this.all_prop_keys[i].length; j++) {
                var cur_prop_key
                if (Array.isArray(this.all_prop_keys[i])) {
                    cur_prop_key = this.all_prop_keys[i][j]
                    var index = text.indexOf(cur_prop_key)
                }
                else {
                    cur_prop_key = this.all_prop_keys[i]
                    var index = text.indexOf(this.all_prop_keys[i])
                }
                if (index === -1) {
                    this.props[this.prop_types[i]][this.all_prop_keys[i][j]] = -1
                    continue
                } 
                index = index + cur_prop_key.length
                while((text[index] === ' ') || (text[index] === '=')) index++ 
                var entries = []
                var string = text[index];
                var first = index
                while(text[index] !== '\n') {
                    if(text[index-1] === (' ') && first !== index ) {
                        entries.push(string)
                        string = text[index] 
                        index++
                        continue;
                    }
                    if (text[index] !== (' ') && text[index] !== (',') && first !== index) 
                        string = string.concat(text[index])
                    index++                    
                }
                if (entries.length === 0) 
                    this.props[this.prop_types[i]][this.all_prop_keys[i][j]] = string
                else {
                    entries.push(string)
                    this.props[this.prop_types[i]][this.all_prop_keys[i][j]] = entries
                }
            }        
        }

    }
    setupFileProperties() {
        return this.props.setup.db_sql_file
    }
    dataFileProperties() {
        return this.props.data_file_props
    }
    trainingSetProperties() {
        return this.props.training_file_props.training_set
    }
    //TODO
    classifierProperties() {

    }
    imageProperties() {
        return {
            tile_size : this.props.tile_size,
            image_props : this.props.image.props
        }
    }
}
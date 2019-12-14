import Utils from './Library/Utils';
import * as NodeFs from 'fs';
import * as NodePath from 'path'



import * as imgr from './Library/Library';

const config =  {
    "sources":  [
        {
            "name": "lego",
            "path": "./test/lego"
        }
    
    ],
    "dbPath": "./test/db.json"
};

const library = new imgr.Library(config);


;(async ()=>{

    library.loadDatabase();
    
    //await library.scanSource('lego')

    console.log(library.getSourceByName('lego').getTree())

    console.log(library.getSources().length)
})();
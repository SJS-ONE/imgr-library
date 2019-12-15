import * as NodePath from 'path';

import ImagesHolder from "./ImagesHolder"; 
import Utils from './Utils';
import Image from '../Image/Image';

import Debug from 'debug';
const DebugImgrLibrarySource = Debug("Imgr:Library:Source");


export interface Config{
    name:string,
    path:string
}

export default class Source extends ImagesHolder(Object){
    
    protected FILETYPES = ['ARW', 'NEF']

    protected config:Config;
    protected tree: {} = {};

    constructor(config:Config){
        super();
        this.config = config;
    }

    public getImageUuidsByPath(path: String, recursive: boolean = true){
        const parts = path.split('/').filter(p => !!p);

        const folder = Utils.readPathInFolder(this.tree, parts);
        if(!folder){
            return undefined;
        }

        return Utils.readFilesRecursiveFromFolder(folder);
    }

    public getImagesByPath(path: String, recursive: boolean = true){
        return this.getImages(this.getImageUuidsByPath(path, recursive));
    }

    public getConfig(){
        return this.config;
    }

    public getTree(){
        return this.tree;
    }

    public async scan() {
        this.tree = await Utils.getFilesInPath(this.getConfig().path, {}, async (file)=>{
            if(!this.FILETYPES.includes(file.path.split('.').pop()) ){
                return undefined;
            }
            const image = await Image.createImageFromPath(file.path)
            this.addImage(image)
            return image.getUuid();
        });
    }

    public static createFromData(data: any){
        const source = new Source(data.config)
        source.loadFromData(data)
        return source;
    }

    public loadFromData(data: any){
        this.tree = data.tree
        this.images = {};
        for(const uuid in data.images){
            const dataImage = data.images[uuid];
            this.images[uuid] = Image.createFromData(dataImage);
        }
    }

}
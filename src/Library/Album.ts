import Image from "../Image/Image";
import ImagesHolder from "./ImagesHolder";

export default class Album extends ImagesHolder(Object){
    protected name:string;

    constructor(name:string){
        super();
        this.name = name;
    }
}
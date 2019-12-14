export interface ImageSize{
    width: number,
    height: number
}

export default class ImageMetadata{
    protected size: ImageSize;
    protected mime: string;

    public constructor(size: ImageSize, mime: string){
        this.size = size;
        this.mime = mime;
    }

    public getSize(){
        return this.size;
    }

    public getMime(){
        return this.mime;
    }
}
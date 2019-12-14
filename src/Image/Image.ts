import ImageMetadata from './ImageMetadata'
import * as RawPreview from 'raw-preview';
import * as NodeCrypto from 'crypto';

export default class Image{

    protected path:string;
    protected metadata:ImageMetadata;
    protected exifData:Object;
    protected base64:string;
    protected uuid:string;

    protected constructor(path:string, metadata:ImageMetadata, exifData:Object, base64:string, uuid: string | undefined = undefined){
        this.path = path;
        this.metadata = metadata;
        this.exifData = exifData;
        this.base64 = base64;
        if(!uuid){
            this.uuid = NodeCrypto.randomBytes(32).toString('hex');
        }else{
            this.uuid = uuid
        }
    }

    public static async createImageFromPath(path:string){
        const {image, exifData} = await RawPreview.getPreviewAndMetadata(path);
        const metaData = new ImageMetadata({height: image.height, width: image.width}, image.mime);
        const img = new Image(path, metaData, exifData, image.base64);
        img.exifData["Exif.Photo.MakerNote"] = '';
        return img;
    }

    public getUuid(){
        return this.uuid;
    }

    public static createFromData(data: any){
        const image = new Image(data.path, data.metadata, data.exifData, data.base64, data.uuid)
        return image;
    }
    
}
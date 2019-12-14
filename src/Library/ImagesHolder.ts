import Image from "../Image/Image";
import {Cache} from "../Cache/Cache";

type Constructor<T = {}> = new (...args: any[]) => T;

export default function ImagesHolder<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        protected images:{[index:string]:Image} = {};

        public getImages(uuids: Array<string> | undefined = undefined){
            if(!uuids){
                return Object.values(this.images);
            }
            return uuids.map(uuid => this.images[uuid])
        }

        public getImage(index:string){
            return this.images[index];
        }

        public addImage(image:Image){
            this.images[image.getUuid()] = image;
        }

        public removeImage(imageToRemove:Image){
            delete this.images[imageToRemove.getUuid()];
        }

        public getAvailableUuids() {
            return Object.keys(this.images);
        }
    };
}
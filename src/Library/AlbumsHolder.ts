import Album from "./Album";

type Constructor<T = {}> = new (...args: any[]) => T;

export default function AlbumsHolder<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    protected albums:Array<Album> = [];

    public getImages(){
        return this.albums;
    }

    public addImage(album:Album){
        this.albums.push(album);
    }

    public removeImage(albumToRemove:Album){
        const index = this.albums.indexOf(albumToRemove);
        if (index > -1) {
            this.albums.splice(index, 1);
            return true;
        }
        return false;
    }
  };
}
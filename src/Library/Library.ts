import Source, {Config as ConfigSource }  from './Source';

import {Database} from '../Database/Database';

import AlbumsHolder from './AlbumsHolder';

import Debug from 'debug';
const DebugImgrLibrary = Debug("Imgr:Library");

export interface Config{
    sources: Array<ConfigSource>,
    dbPath: string
}

export class Library extends AlbumsHolder(Object){

    protected config:Config;
    protected sources:Array<Source> = [];
    protected db: Database;

    public constructor(config:Config){
        super();
        this.config = config;

        this.db = new Database(config.dbPath);

        for(let sourceConfig of this.config.sources){
            this.sources.push(new Source(sourceConfig))
        }
    }

    public loadDatabase(){
        const data = this.db.getData();
        const dataSources = data.sources || []; 
        this.sources = dataSources.map((dataSource: any) => Source.createFromData(dataSource))
        DebugImgrLibrary('Sourced loaded from Database: '+this.sources.length)
        //this.sources = dataSources;
    }

    public getSourceByName(sourceName:string): Source{
        for(let source of this.sources){
            if(sourceName == source.getConfig().name){
                return source
            }
        }
        throw Error('no source with name: "'+sourceName+'" configured');
    }

    public async scanSource(sourceName:string){
        DebugImgrLibrary('scanning source: ', sourceName)
        const source = this.getSourceByName(sourceName);
        try{
            await source.scan();
        }catch(e){
            DebugImgrLibrary(''+e);
        }
        DebugImgrLibrary('scanning source finished: ', sourceName)
        this.db.setData({
            sources: this.sources
        });
        this.db.save();
    }

    public getImageByUuid(uuid: string){
        for(let source of this.sources){
            const image = source.getImage(uuid);
            if(image){
                return image;
            }
        }
        return null;
    }

    public getSources() {
        return this.sources
    }

    public hasSource(sourceName:string){
        for(let source of this.sources){
            if(sourceName == source.getConfig().name){
                return true
            }
        }
        return false
    }

}
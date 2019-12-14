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
        const dbSources = dataSources.map((dataSource: any) => Source.createFromData(dataSource))
        
        for(const dbSource of dbSources){
            let found = false;
            for(const index in this.sources){
                const source = this.sources[index]
                if(source.config.name == dbSource.config.name){
                    found = true;
                    this.sources[index] = dbSource
                    break;
                }
            }
            if(!found){
                this.sources.push(dbSource)
            }
            
        }
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
        if(!this.config.skipDbSave){
            this.db.setData({
                sources: this.sources
            });
            this.db.save();
        }
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
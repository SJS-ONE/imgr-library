
import * as NodeFs from "fs";

import Debug from 'debug';
const DebugImgrDatabase = Debug("Imgr:Database");

type DatabaseConfig = {
    filePath:string
}

export class Database{

    protected config:DatabaseConfig = {
        filePath: ''
    };


    protected data = {};
    protected metadata = {};

    public constructor(filePath: string){
        this.config.filePath = filePath;
        this.createIfNotExists();
        this.read();
    }

    protected create(){
        NodeFs.closeSync(NodeFs.openSync(this.config.filePath, 'a'))
    }

    protected createIfNotExists(){
        if(!NodeFs.existsSync(this.config.filePath)){
            this.create()
        }
    }

    protected read(){
        DebugImgrDatabase('Reading from database file')
        const json = NodeFs.readFileSync(this.config.filePath).toString();
        if(json == ""){
            this.data = {};
            this.metadata = {};
        }else{
            const all = JSON.parse(json);
            this.data = all.data;
            this.metadata = all.metadata
        }
        DebugImgrDatabase('Reading from database file FINISHED')
    }

    public save() {
        DebugImgrDatabase('Saving to database file')
        this.metadata.lastUpdate = Date.now();
        const json = JSON.stringify({data: this.data, metadata: this.metadata}, null, 2);
        NodeFs.writeFileSync(this.config.filePath, json);
        DebugImgrDatabase('Saving to database file FINISHED')
    }

    public lastUpdate(){
        return this.metadata.lastUpdate
    }

    public getData(){
        return this.data;
    }

    public setData(data:any){
        DebugImgrDatabase('Setting data')
        this.data = data;
        DebugImgrDatabase('Setting data FINISHED')
    }
}

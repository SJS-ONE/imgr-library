import * as NodeFs from 'fs';
import * as NodePath from 'path';
import * as NodeCrypto from 'crypto';


type File = {
    path:string,
    stat:NodeFs.Stats
}

type Folder = {
    files: Array<File>,
    name: string
    folder: Array<Folder>
}

const walkDir = (dir:string, done:Function, cb = async (file:File)=>file, options = {}) =>  {
    const folder:Folder = {
        files: [],
        name: NodePath.basename(dir),
        folder: []
    };
    NodeFs.readdir(dir,  (err, items) =>  {
        if (err) return done(err);
        let remainingItems = items.length;
        if (!remainingItems) return done(null, folder);
        for(let itemName of items){
            const filePath = NodePath.resolve(dir, itemName);
            NodeFs.stat(filePath, async (err, stat) => {
                if (stat && stat.isDirectory()) {
                    walkDir(filePath, (_:any, res:Folder) =>  {
                        folder.folder.push(res)
                        if (!--remainingItems) done(null, folder);
                    }, cb, options);
                } else {
                    const file:File = {
                        path: filePath,
                        stat: stat
                    }
                    const cbRes = await cb(file);
                    if(cbRes){
                        folder.files.push(cbRes)
                    }
                    if (!--remainingItems) done(null, folder);
                }
            });
        };
    });
};

const asyncWalkDir = (dir:string, cb = async (file:File)=>file, options:Object = {}) =>  {
    return new Promise((res, rej) => {
        walkDir(dir, (err:any, results:Array<File>)=>{
            if(err){ rej(err) }
            res(results)
        },cb, options)
    })
}

const getFolderFromFolder = (folder: Folder, name: string) => {
    const found = folder.folder.filter(f => f.name === name)
    return found[0]
}

export default class Utils{
    public static async getFilesInPath(path:string, options:Object = {}, cb = async (file:File)=>file){
        return await asyncWalkDir(path, cb, options)
    }

    public static async generateUid(size=16){
        return new Promise((res, rej)=>{
            NodeCrypto.randomBytes(size, (err,buf)=>{
                if(err){ rej(err) }
                res(buf.toString('hex'))
            })
        })
    }

    public static readPathInFolder(folder: Folder, pathParts: Array<string>){
        const first = pathParts.shift();
        const nextFolder = getFolderFromFolder(folder, first);

        if(nextFolder === undefined){
            return undefined
        }

        if(pathParts.length > 0){
            return this.readPathInFolder(nextFolder, pathParts)
        }else{
            return nextFolder;
        }
    }

    public static readFilesRecursiveFromFolder(folder: Folder) {
        const files = [...folder.files];
        for(const recFolder of folder.folder){
            files.push(...this.readFilesRecursiveFromFolder(recFolder));
        }
        return files;
    }
}
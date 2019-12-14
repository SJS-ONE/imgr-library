


export class Cache{
    private static instance: Cache;

    protected data = {};


    private constructor() {
    
    }

    static getInstance(): Cache {
        if (!Cache.instance) {
            Cache.instance = new Cache();
        }
        return Cache.instance;
    }
    
}
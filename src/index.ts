const _proxy_pool = {}

function debounce(fn: Function, delay: number): Function{
    let timer = null;
    return function(...args){
        if(timer) {
            clearTimeout(timer)
            timer = null;
        }
        timer = setTimeout(fn, delay, args)
    }
}

declare interface IStorage{
    getItem(key: string): string;
    setItem(key: string, value: string):void
}

declare interface IOptions{
    debounceSaveDelay?: number;
    storage?: IStorage;
}

class Handler {
    
    private storage: IStorage = localStorage
    private names: string[] = []
    private debounceSave: Function

    constructor(delay?: number, storage?:IStorage){
        if(storage) this.storage = storage;

        this.debounceSave = debounce(() =>{
            if(_proxy_pool[this.names[0]]){
                this.storage.setItem(this.names[0], JSON.stringify(_proxy_pool[this.names[0]]))
                this.names.length = 0;
            }
        }, delay || 100)
    }
    
    get(target, propKey:string|number ){
        let name:string = Object.getPrototypeOf(target).constructor.name;
        this.names.push(name)
        return Reflect.get(target, propKey)
    }

    set(target, propKey:string|number, value){
        let isObject = typeof value === 'object'
        let newValue = isObject? defineProxy(value, this) : value
        let name = Object.getPrototypeOf(target).constructor.name;
        this.names.push(name)
        this.debounceSave()
        return Reflect.set(target, propKey, newValue)
    }

    deleteProperty(target, propKey:string|number){
        let name = Object.getPrototypeOf(target).constructor.name;
        this.names.push(name)
        this.debounceSave()
        return Reflect.deleteProperty(target, propKey)
    }
}

function defineProxy(target, handler){
    Object.keys(target).forEach(key => {
        if(typeof target[key] === 'object'){
            target[key] = defineProxy(target[key], handler)
        }
    })
    return new Proxy(target, handler)
}


/**
 * 创建一个代理对象,当对象的数据改变时,自动将对象序列化为json保存到localStorage,
 * 数据在localStorage中存取的key为传入的Class的名称.
 * 
 * creates a proxy, whenever the data were changed, it will be serialized to json 
 * string and putted into localStorage with it's class name `Class.name` as the key.
 * 
 * @param Class The name of the class that needs to be handled.
 */
export default function LocalStorageWrapper<T>(Class, opt:IOptions={} ):T {
    let name = Class.name
    let storage = opt.storage || localStorage
    if(_proxy_pool[name]){
        throw new Error("Local Storage Wrappers can have only one instance")
    }
    let data = storage.getItem(name)
    let localState = data ? JSON.parse(data) : undefined
    let state = new Class();
    // override the default value if necessary
    if(localState) Object.assign(state, localState)
    _proxy_pool[name] = defineProxy(state, new Handler(opt.debounceSaveDelay, storage) )

    return _proxy_pool[name];
}

export { LocalStorageWrapper }
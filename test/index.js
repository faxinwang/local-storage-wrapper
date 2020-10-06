const _proxy_pool = {};
function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(fn, delay, args);
    };
}
class Handler {
    constructor(delay, storage) {
        this.storage = localStorage;
        this.names = [];
        if (storage)
            this.storage = storage;
        this.debounceSave = debounce(() => {
            if (_proxy_pool[this.names[0]]) {
                this.storage.setItem(this.names[0], JSON.stringify(_proxy_pool[this.names[0]]));
                this.names.length = 0;
            }
        }, delay || 100);
    }
    get(target, propKey) {
        let name = Object.getPrototypeOf(target).constructor.name;
        this.names.push(name);
        return Reflect.get(target, propKey);
    }
    set(target, propKey, value) {
        let isObject = typeof value === 'object';
        let newValue = isObject ? defineProxy(value, this) : value;
        let name = Object.getPrototypeOf(target).constructor.name;
        this.names.push(name);
        this.debounceSave();
        return Reflect.set(target, propKey, newValue);
    }
    deleteProperty(target, propKey) {
        let name = Object.getPrototypeOf(target).constructor.name;
        this.names.push(name);
        this.debounceSave();
        return Reflect.deleteProperty(target, propKey);
    }
}
function defineProxy(target, handler) {
    Object.keys(target).forEach(key => {
        if (typeof target[key] === 'object') {
            target[key] = defineProxy(target[key], handler);
        }
    });
    return new Proxy(target, handler);
}
function LocalStorageWrapper(Class, opt = {}) {
    let name = Class.name;
    let storage = opt.storage || localStorage;
    if (_proxy_pool[name]) {
        throw new Error("Local Storage Wrappers can have only one instance");
    }
    let data = storage.getItem(name);
    let localState = data ? JSON.parse(data) : undefined;
    let state = new Class();
    if (localState)
        Object.assign(state, localState);
    _proxy_pool[name] = defineProxy(state, new Handler(opt.debounceSaveDelay, storage));
    return _proxy_pool[name];
}
// export { LocalStorageWrapper };

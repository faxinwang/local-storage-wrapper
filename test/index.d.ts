declare interface IStorage {
    getItem(key: string): string;
    setItem(key: string, value: string): void;
}
declare interface IOptions {
    debounceSaveDelay?: number;
    storage?: IStorage;
}
export default function LocalStorageWrapper<T>(Class: any, opt?: IOptions): T;
export { LocalStorageWrapper };

export class StorageKey<T> {
    constructor(private _key: string) {

    }

    public get key(): string { return this._key; }
    
}
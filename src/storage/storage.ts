import { StorageKey } from './storage-key';

export class TypedStorage {
    constructor(
        protected _namespace: string,
        protected _storage: Storage
    ) {

    }

    public get namespace(): string { return this._namespace; };

    public get<T>(key: StorageKey<T>): T {

    }
}
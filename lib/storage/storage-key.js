var StorageKey = (function () {
    /**
     * @param {?} _key
     */
    function StorageKey(_key) {
        this._key = _key;
    }
    Object.defineProperty(StorageKey.prototype, "key", {
        /**
         * @return {?}
         */
        get: function () { return this._key; },
        enumerable: true,
        configurable: true
    });
    return StorageKey;
}());
export { StorageKey };
//# sourceMappingURL=C:/cygwin64/home/cdibbs/git/angular-oauth2-oidc/src/storage/storage-key.js.map
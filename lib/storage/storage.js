var TypedStorage = (function () {
    /**
     * @param {?} _namespace
     * @param {?} _storage
     */
    function TypedStorage(_namespace, _storage) {
        this._namespace = _namespace;
        this._storage = _storage;
    }
    Object.defineProperty(TypedStorage.prototype, "namespace", {
        /**
         * @return {?}
         */
        get: function () { return this._namespace; },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * @param {?} key
     * @return {?}
     */
    TypedStorage.prototype.get = function (key) {
        return ({});
    };
    return TypedStorage;
}());
export { TypedStorage };
//# sourceMappingURL=D:/temp/angular-oauth2-oidc/src/storage/storage.js.map
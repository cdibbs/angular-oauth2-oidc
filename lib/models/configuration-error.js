var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ConfigurationError = (function (_super) {
    __extends(ConfigurationError, _super);
    /**
     * @param {?} message
     * @param {?} errors
     */
    function ConfigurationError(message, errors) {
        var _this = _super.call(this, JSON.stringify(errors)) || this;
        _this.message = message;
        _this.errors = errors;
        return _this;
    }
    return ConfigurationError;
}(Error));
export { ConfigurationError };
//# sourceMappingURL=D:/temp/angular-oauth2-oidc/lib/models/configuration-error.js.map
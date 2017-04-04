var ConfigValidationResult = (function () {
    /**
     * @param {?=} message
     * @param {?=} property
     * @param {?=} valid
     */
    function ConfigValidationResult(message, property, valid) {
        if (message === void 0) { message = ""; }
        if (property === void 0) { property = "N/A"; }
        if (valid === void 0) { valid = false; }
        this.message = message;
        this.property = property;
        this.valid = valid;
    }
    /**
     * @return {?}
     */
    ConfigValidationResult.prototype.toString = function () {
        return (this.valid ? "" : "Error:") + " " + this.message + " (Property: " + this.property + ").";
    };
    return ConfigValidationResult;
}());
export { ConfigValidationResult };
//# sourceMappingURL=D:/temp/angular-oauth2-oidc/lib/models/config-validation-result.js.map
var TokenValidationResult = (function () {
    /**
     * @param {?=} message
     */
    function TokenValidationResult(message) {
        this.Valid = true;
        this.Message = "No error.";
        this.Message = message;
        this.Valid = !message;
    }
    return TokenValidationResult;
}());
export { TokenValidationResult };
TokenValidationResult.Ok = new TokenValidationResult();
function TokenValidationResult_tsickle_Closure_declarations() {
    /** @type {?} */
    TokenValidationResult.prototype.Valid;
    /** @type {?} */
    TokenValidationResult.prototype.Message;
    /** @type {?} */
    TokenValidationResult.prototype.Ok;
}
//# sourceMappingURL=D:/temp/angular-oauth2-oidc/lib/models/token-validation-result.js.map
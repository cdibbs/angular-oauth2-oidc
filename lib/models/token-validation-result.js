export class TokenValidationResult {
    /**
     * @param {?=} message
     */
    constructor(message) {
        this.Valid = true;
        this.Message = "No error.";
        this.Message = message;
        this.Valid = !message;
    }
}
TokenValidationResult.Ok = new TokenValidationResult();
function TokenValidationResult_tsickle_Closure_declarations() {
    /** @type {?} */
    TokenValidationResult.prototype.Valid;
    /** @type {?} */
    TokenValidationResult.prototype.Message;
    /** @type {?} */
    TokenValidationResult.prototype.Ok;
}
//# sourceMappingURL=C:/cygwin64/home/cdibbs/git/angular-oauth2-oidc/src/models/token-validation-result.js.map
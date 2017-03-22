var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { BaseOAuthConfig } from './base-oauth-config';
var PasswordConfig = (function (_super) {
    __extends(PasswordConfig, _super);
    function PasswordConfig() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.kind = "password";
        _this.autoLoadUserProfile = true;
        _this.fallbackUserInfoEndpoint = null;
        return _this;
    }
    return PasswordConfig;
}(BaseOAuthConfig));
export { PasswordConfig };
function PasswordConfig_tsickle_Closure_declarations() {
    /** @type {?} */
    PasswordConfig.prototype.kind;
    /**
     * Whether to immediately load the profile from the user endpoint following successful login.
     * @type {?}
     */
    PasswordConfig.prototype.autoLoadUserProfile;
    /**
     * This is unnecessary, but provided, anyway.
     * @type {?}
     */
    PasswordConfig.prototype.dummyClientSecret;
    /**
     * If discovery fails, use this endpoint for retrieving user info.
     * @type {?}
     */
    PasswordConfig.prototype.fallbackUserInfoEndpoint;
}
//# sourceMappingURL=D:/temp/angular-oauth2-oidc/src/models/password-config.js.map
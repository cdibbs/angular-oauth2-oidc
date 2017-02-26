import { BaseOAuthConfig } from './base-oauth-config';
export class PasswordConfig extends BaseOAuthConfig {
    constructor() {
        super(...arguments);
        this.kind = "password";
        this.autoLoadUserProfile = true;
        this.fallbackUserInfoEndpoint = null;
    }
}
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
//# sourceMappingURL=C:/cygwin64/home/cdibbs/git/angular-oauth2-oidc/src/models/password-config.js.map
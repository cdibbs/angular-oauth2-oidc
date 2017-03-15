import { BaseOAuthConfig } from './base-oauth-config';
export class OIDCConfig extends BaseOAuthConfig {
    constructor() {
        super(...arguments);
        this.kind = "oidc";
    }
}
function OIDCConfig_tsickle_Closure_declarations() {
    /** @type {?} */
    OIDCConfig.prototype.kind;
}
//# sourceMappingURL=D:/temp/angular-oauth2-oidc/src/models/oidc-config.js.map
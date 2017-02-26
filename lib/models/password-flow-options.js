import { BaseFlowOptions } from './base-flow-options';
export class PasswordFlowOptions extends BaseFlowOptions {
    constructor() {
        super(...arguments);
        this.autoLoadUserProfile = false;
    }
}
function PasswordFlowOptions_tsickle_Closure_declarations() {
    /** @type {?} */
    PasswordFlowOptions.prototype.Username;
    /** @type {?} */
    PasswordFlowOptions.prototype.Password;
    /** @type {?} */
    PasswordFlowOptions.prototype.autoLoadUserProfile;
}
//# sourceMappingURL=C:/cygwin64/home/cdibbs/git/angular-oauth2-oidc/src/models/password-flow-options.js.map
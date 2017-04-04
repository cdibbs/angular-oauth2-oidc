var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { BaseFlowOptions } from './base-flow-options';
var PasswordFlowOptions = (function (_super) {
    __extends(PasswordFlowOptions, _super);
    function PasswordFlowOptions() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.autoLoadUserProfile = false;
        return _this;
    }
    return PasswordFlowOptions;
}(BaseFlowOptions));
export { PasswordFlowOptions };
function PasswordFlowOptions_tsickle_Closure_declarations() {
    /** @type {?} */
    PasswordFlowOptions.prototype.Username;
    /** @type {?} */
    PasswordFlowOptions.prototype.Password;
    /** @type {?} */
    PasswordFlowOptions.prototype.autoLoadUserProfile;
}
//# sourceMappingURL=D:/temp/angular-oauth2-oidc/lib/models/password-flow-options.js.map
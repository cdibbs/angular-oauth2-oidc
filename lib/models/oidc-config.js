var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { BaseOAuthConfig } from './base-oauth-config';
var OIDCConfig = (function (_super) {
    __extends(OIDCConfig, _super);
    function OIDCConfig() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.kind = "oidc";
        _this.useIFrameRefresh = false;
        _this.iFrameRefreshUri = null;
        return _this;
    }
    return OIDCConfig;
}(BaseOAuthConfig));
export { OIDCConfig };
function OIDCConfig_tsickle_Closure_declarations() {
    /** @type {?} */
    OIDCConfig.prototype.kind;
    /** @type {?} */
    OIDCConfig.prototype.useIFrameRefresh;
    /** @type {?} */
    OIDCConfig.prototype.iFrameRefreshUri;
}
//# sourceMappingURL=C:/cygwin64/home/cdibbs/git/angular-oauth2-oidc/lib/models/oidc-config.js.map
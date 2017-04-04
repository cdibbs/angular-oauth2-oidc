var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { BaseConfigValidator } from './base-config-validator-service';
import { ConfigValidationResult } from '../models';
var OIDCConfigValidatorService = (function (_super) {
    __extends(OIDCConfigValidatorService, _super);
    function OIDCConfigValidatorService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} config
     * @return {?}
     */
    OIDCConfigValidatorService.prototype.validate = function (config) {
        var /** @type {?} */ results = _super.prototype.validate.call(this, config);
        if (!config)
            return results;
        if (config.useIFrameRefresh) {
            if (!this.nonEmptyString(config.iFrameRefreshUri)) {
                results.push(new ConfigValidationResult("When useIFrameRefresh == true, you must provide a refresh URI.", "iFrameRefreshUri"));
            }
            if (config.sessionRefreshInterval < 0.5) {
                results.push(new ConfigValidationResult("Cannot be less than 0.5 minutes (30 seconds).", "sessionRefreshInterval"));
            }
            if (config.userActivityWindow <= 0.5) {
                results.push(new ConfigValidationResult("Must be greater than 0.5 minutes (30 seconds).", "userActivityWindow"));
            }
        }
        return results;
    };
    return OIDCConfigValidatorService;
}(BaseConfigValidator));
export { OIDCConfigValidatorService };
//# sourceMappingURL=D:/temp/angular-oauth2-oidc/lib/validators/oidc-config-validator-service.js.map
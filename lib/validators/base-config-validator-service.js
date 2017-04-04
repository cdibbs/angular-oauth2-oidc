import { ConfigValidationResult } from '../models';
var BaseConfigValidator = (function () {
    function BaseConfigValidator() {
    }
    /**
     * @param {?} config
     * @return {?}
     */
    BaseConfigValidator.prototype.validate = function (config) {
        var /** @type {?} */ results;
        if (!config)
            return [new ConfigValidationResult("Supplied configuration cannot be null.")];
        results = [];
        if (!this.nonEmptyString(config.redirectUri)) {
            results.push(new ConfigValidationResult("Must supply a valid URI.", "redirectUri"));
        }
        if (!config.useDiscovery) {
            var /** @type {?} */ useDisc_Uri = "Must supply a valid URI when useDiscovery == false.";
            if (!this.nonEmptyString(config.fallbackLoginUri)) {
                results.push(new ConfigValidationResult(useDisc_Uri, "fallbackLoginUri"));
            }
            if (!this.nonEmptyString(config.fallbackLogoutUri)) {
                results.push(new ConfigValidationResult(useDisc_Uri, "fallbackLogoutUri"));
            }
            if (!this.nonEmptyString(config.fallbackTokenEndpoint)) {
                results.push(new ConfigValidationResult(useDisc_Uri, "fallbackTokenEndpoint"));
            }
        }
        if (!config.storage) {
            results.push(new ConfigValidationResult("Must provide valid storage backend, or omit to use default.", "storage"));
        }
        if (typeof config.logFactory != "function") {
            results.push(new ConfigValidationResult("Must provide valid logFactory, or omit to use default.", "logFactory"));
        }
        if (!this.nonEmptyString(config.clientId)) {
            results.push(new ConfigValidationResult("Must provide a non-empty clientId.", "clientId"));
        }
        return results;
    };
    /**
     * @param {?} e
     * @return {?}
     */
    BaseConfigValidator.prototype.nonEmptyString = function (e) {
        return e && typeof e === "string";
    };
    return BaseConfigValidator;
}());
export { BaseConfigValidator };
//# sourceMappingURL=D:/temp/angular-oauth2-oidc/lib/validators/base-config-validator-service.js.map
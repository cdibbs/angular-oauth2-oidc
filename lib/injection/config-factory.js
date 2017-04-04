import { OIDCConfig, BaseOAuthConfig, PasswordConfig, ConfigurationError } from '../models';
/**
 * Ensures final, injected config has default options + user options.
\@param userConfig The user-supplied options, minus defaults.
\@param log Logging
\@return An implementation of IOAuthConfig with defaults and user-specified options.
 * @param {?} userConfig
 * @param {?} log
 * @param {?} validator
 * @return {?}
 */
export function configFactory(userConfig, log, validator) {
    var /** @type {?} */ c;
    switch (userConfig.kind) {
        case "oidc":
            c = extend(new OIDCConfig(), userConfig);
            break;
        case "password":
            c = extend(new PasswordConfig(), userConfig);
            break;
        default:
            log.warn("Unrecognized config type " + userConfig.kind + ".");
            c = extend(new BaseOAuthConfig(), userConfig);
            break;
    }
    var /** @type {?} */ results = validator.validate(c);
    if (results.length) {
        throw new ConfigurationError("Configuration errors found.", results);
    }
    return c;
}
/**
 * @param {...?} args
 * @return {?}
 */
export function extend() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var /** @type {?} */ newObj = {};
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var obj = args_1[_a];
        for (var /** @type {?} */ key in obj) {
            //copy all the fields
            newObj[key] = obj[key];
        }
    }
    return newObj;
}
;
//# sourceMappingURL=D:/temp/angular-oauth2-oidc/lib/injection/config-factory.js.map
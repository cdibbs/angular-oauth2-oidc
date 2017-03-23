/**
 * @param {?} strategies
 * @param {?} config
 * @return {?}
 */
export function authStrategyFactory(strategies, config) {
    return strategies.filter(function (s) { return s.kind == config.kind; })[0];
}
//# sourceMappingURL=D:/temp/angular-oauth2-oidc/src/injection/auth-strategy-factory.js.map
/**
 * @param {?} strategies
 * @param {?} config
 * @return {?}
 */
export function authStrategyFactory(strategies, config) {
    return strategies.filter(function (s) { return s.kind == config.kind; })[0];
}
//# sourceMappingURL=C:/cygwin64/home/cdibbs/git/angular-oauth2-oidc/lib/injection/auth-strategy-factory.js.map
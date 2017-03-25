import { NgModule } from '@angular/core';
import { OAuthService } from './oauth-service';
import { AuthStrategyToken, SelectedAuthStrategyToken } from './base-auth-strategy';
import { OIDCAuthStrategy } from './oidc-auth-strategy';
import { PasswordAuthStrategy } from './password-auth-strategy';
import { BaseOAuthConfig, UserProvidedConfig } from './models';
import { ConfigValidatorToken } from './validators/i';
import { OIDCConfigValidatorService } from './validators';
import { CheckSessionIFrame } from './check-session-iframe';
import { LogServiceToken } from './i';
import { authStrategyFactory, configFactory } from './injection';
var OAuthModule = (function () {
    function OAuthModule() {
    }
    /**
     * @param {?} config
     * @return {?}
     */
    OAuthModule.forRoot = function (config) {
        return {
            ngModule: OAuthModule,
            providers: [/** @type {?} */ ({ provide: OAuthService, useClass: OAuthService }), /** @type {?} */ ({ provide: AuthStrategyToken, useClass: OIDCAuthStrategy, multi: true }), /** @type {?} */ ({ provide: AuthStrategyToken, useClass: PasswordAuthStrategy, multi: true }), /** @type {?} */ ({ provide: ConfigValidatorToken, useClass: OIDCConfigValidatorService, multi: false }), /** @type {?} */ ({ provide: CheckSessionIFrame, useClass: CheckSessionIFrame }), /** @type {?} */ ({ provide: UserProvidedConfig, useValue: config }), /** @type {?} */ ({ provide: BaseOAuthConfig, useFactory: configFactory, deps: [UserProvidedConfig, LogServiceToken, ConfigValidatorToken] }), /** @type {?} */ ({ provide: SelectedAuthStrategyToken, useFactory: authStrategyFactory, deps: [AuthStrategyToken, BaseOAuthConfig] }), /** @type {?} */ ({ provide: LogServiceToken, useFactory: config.logFactory })
            ]
        };
    };
    return OAuthModule;
}());
export { OAuthModule };
OAuthModule.decorators = [
    { type: NgModule, args: [{
                imports: [],
                declarations: [],
                exports: []
            },] },
];
/**
 * @nocollapse
 */
OAuthModule.ctorParameters = function () { return []; };
function OAuthModule_tsickle_Closure_declarations() {
    /** @type {?} */
    OAuthModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    OAuthModule.ctorParameters;
}
//# sourceMappingURL=C:/cygwin64/home/cdibbs/git/angular-oauth2-oidc/lib/module.js.map
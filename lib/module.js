var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var OAuthModule = OAuthModule_1 = (function () {
    function OAuthModule() {
    }
    /**
     * @param {?} config
     * @return {?}
     */
    OAuthModule.forRoot = function (config) {
        return {
            ngModule: OAuthModule_1,
            providers: [/** @type {?} */ ({ provide: OAuthService, useClass: OAuthService }), /** @type {?} */ ({ provide: AuthStrategyToken, useClass: OIDCAuthStrategy, multi: true }), /** @type {?} */ ({ provide: AuthStrategyToken, useClass: PasswordAuthStrategy, multi: true }), /** @type {?} */ ({ provide: ConfigValidatorToken, useClass: OIDCConfigValidatorService, multi: false }), /** @type {?} */ ({ provide: CheckSessionIFrame, useClass: CheckSessionIFrame }), /** @type {?} */ ({ provide: UserProvidedConfig, useValue: config }), /** @type {?} */ ({ provide: BaseOAuthConfig, useFactory: configFactory, deps: [UserProvidedConfig, LogServiceToken, ConfigValidatorToken] }), /** @type {?} */ ({ provide: SelectedAuthStrategyToken, useFactory: authStrategyFactory, deps: [AuthStrategyToken, BaseOAuthConfig] }), /** @type {?} */ ({ provide: LogServiceToken, useFactory: config.logFactory })
            ]
        };
    };
    return OAuthModule;
}());
OAuthModule = OAuthModule_1 = __decorate([
    NgModule({
        imports: [],
        declarations: [],
        exports: []
    })
], OAuthModule);
export { OAuthModule };
var OAuthModule_1;
//# sourceMappingURL=D:/temp/angular-oauth2-oidc/lib/module.js.map
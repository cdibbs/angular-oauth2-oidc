var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { OAuthService } from './oauth-service';
import { AuthStrategyToken } from './base-auth-strategy';
import { OIDCAuthStrategy } from './oidc-auth-strategy';
import { PasswordAuthStrategy } from './password-auth-strategy';
import { BaseOAuthConfig } from './models';
import { CheckSessionIFrame } from './check-session-iframe';
import { LogServiceToken } from './i';
import { AuthStrategyFactory } from './auth-strategy-factory';
let OAuthModule = OAuthModule_1 = class OAuthModule {
    /**
     * @param {?} config
     * @return {?}
     */
    static forRoot(config) {
        return ({
            ngModule: OAuthModule_1,
            providers: [/** @type {?} */ ({ provide: OAuthService, useClass: OAuthService }), /** @type {?} */ ({ provide: AuthStrategyToken, useClass: OIDCAuthStrategy, multi: true }), /** @type {?} */ ({ provide: AuthStrategyToken, useClass: PasswordAuthStrategy, multi: true }), /** @type {?} */ ({ provide: CheckSessionIFrame, useClass: CheckSessionIFrame }), /** @type {?} */ ({ provide: AuthStrategyFactory, useClass: AuthStrategyFactory }), /** @type {?} */ ({ provide: BaseOAuthConfig, useValue: config }), /** @type {?} */ ({ provide: LogServiceToken, useValue: config.log })
            ]
        });
    }
};
OAuthModule = OAuthModule_1 = __decorate([
    NgModule({
        imports: [],
        declarations: [],
        exports: []
    })
], OAuthModule);
export { OAuthModule };
var OAuthModule_1;
//# sourceMappingURL=C:/cygwin64/home/cdibbs/git/angular-oauth2-oidc/src/module.js.map
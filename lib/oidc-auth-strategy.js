var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Http } from '@angular/http';
import { DOCUMENT } from '@angular/platform-browser';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { BaseAuthStrategy } from './base-auth-strategy';
import { CheckSessionIFrame } from './check-session-iframe';
import { BaseOAuthConfig } from './models';
/**
 * Represents an OIDC authentication strategy.
The OpenID Connect (OIDC) strategy can provide JWT-encoded roles and basic profile
information, as configured. More information can be found, here:
https://en.wikipedia.org/wiki/OpenID_Connect
 */
let OIDCAuthStrategy = class OIDCAuthStrategy extends BaseAuthStrategy {
    /**
     * @param {?} http
     * @param {?} router
     * @param {?} jwt
     * @param {?} document
     * @param {?} iframe
     * @param {?} _config
     */
    constructor(http, router, jwt, document, iframe, _config) {
        super(http, router, _config, jwt, document);
        this.http = http;
        this.router = router;
        this.jwt = jwt;
        this.document = document;
        this.iframe = iframe;
    }
    /**
     * @return {?}
     */
    get kind() { return "oidc"; }
    ;
    /**
     * @return {?}
     */
    get checkSessionIFrameUri() { return this.fetchDocProp("check_session_iframe", "FallbackCheckSessionIFrame"); }
    /**
     * @param {?=} options
     * @return {?}
     */
    initiateLoginFlow(options = null) {
        let /** @type {?} */ gotoLogin = () => {
            var /** @type {?} */ url = this.createLoginUrl((options && options.additionalState) || null);
            this.document.location.href = url;
            return true;
        };
        if (!this.discoveryDocumentLoaded && this.config.useDiscovery) {
            this.loadDiscoveryDocument().then(d => gotoLogin());
        }
        else {
            return new Promise((resolve, reject) => {
                if (gotoLogin())
                    resolve(true);
                else
                    reject("Login URL creation failed.");
            });
        }
    }
    /**
     * @param {?=} extraState
     * @return {?}
     */
    createLoginUrl(extraState = undefined) {
        let /** @type {?} */ nonce = this.createAndSaveNonce();
        let /** @type {?} */ url = super.createLoginUrl(extraState, nonce);
        url += "&nonce=" + encodeURIComponent(nonce);
        return url;
    }
    /**
     * @param {?=} timeout
     * @return {?}
     */
    refreshSession(timeout = 30000) {
        return this.iframe.navigate(this.checkSessionIFrameUri, timeout);
    }
};
OIDCAuthStrategy = __decorate([
    Injectable(),
    __param(3, Inject(DOCUMENT)),
    __metadata("design:paramtypes", [Http,
        Router,
        JwtHelper, Object, CheckSessionIFrame,
        BaseOAuthConfig])
], OIDCAuthStrategy);
export { OIDCAuthStrategy };
//# sourceMappingURL=C:/cygwin64/home/cdibbs/git/angular-oauth2-oidc/src/oidc-auth-strategy.js.map
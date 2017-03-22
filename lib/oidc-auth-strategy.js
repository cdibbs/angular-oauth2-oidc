var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
import { BaseAuthStrategy } from './base-auth-strategy';
import { CheckSessionIFrame } from './check-session-iframe';
import { BaseOAuthConfig } from './models';
/**
 * Represents an OIDC authentication strategy.
The OpenID Connect (OIDC) strategy can provide JWT-encoded roles and basic profile
information, as configured. More information can be found, here:
https://en.wikipedia.org/wiki/OpenID_Connect
 */
var OIDCAuthStrategy = (function (_super) {
    __extends(OIDCAuthStrategy, _super);
    /**
     * @param {?} http
     * @param {?} router
     * @param {?} document
     * @param {?} iframe
     * @param {?} _config
     */
    function OIDCAuthStrategy(http, router, document, iframe, _config) {
        var _this = _super.call(this, http, router, _config, document) || this;
        _this.http = http;
        _this.router = router;
        _this.document = document;
        _this.iframe = iframe;
        return _this;
    }
    Object.defineProperty(OIDCAuthStrategy.prototype, "kind", {
        /**
         * @return {?}
         */
        get: function () { return "oidc"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(OIDCAuthStrategy.prototype, "checkSessionIFrameUri", {
        /**
         * @return {?}
         */
        get: function () { return this.createLoginUrl("refresh"); },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    OIDCAuthStrategy.prototype.completeLoginFlow = function () {
        var _this = this;
        return _super.prototype.completeLoginFlow.call(this)
            .then(function (jwt) {
            var /** @type {?} */ state = _this.config.storage.getItem("state");
            if (state == "refresh" && window.parent && typeof window.parent["oidcRefreshComplete"] == "function") {
                _this.config.storage.removeItem("state");
                window.parent["oidcRefreshComplete"]();
                document["completeRefresh"](jwt);
            }
            return jwt;
        });
    };
    /**
     * @param {?=} options
     * @return {?}
     */
    OIDCAuthStrategy.prototype.initiateLoginFlow = function (options) {
        var _this = this;
        if (options === void 0) { options = null; }
        var /** @type {?} */ gotoLogin = function () {
            var /** @type {?} */ url = _this.createLoginUrl((options && options.additionalState) || null);
            _this.document.location.href = url;
            return true;
        };
        if (!this.discoveryDocumentLoaded && this.config.useDiscovery) {
            this.loadDiscoveryDocument().then(function (d) { return gotoLogin(); });
        }
        else {
            return new Promise(function (resolve, reject) {
                if (gotoLogin())
                    resolve(true);
                else
                    reject("Login URL creation failed.");
            });
        }
    };
    /**
     * @param {?=} extraState
     * @return {?}
     */
    OIDCAuthStrategy.prototype.createLoginUrl = function (extraState) {
        if (extraState === void 0) { extraState = undefined; }
        var /** @type {?} */ nonce = this.createAndSaveNonce();
        var /** @type {?} */ url = _super.prototype.createLoginUrl.call(this, extraState, nonce);
        url += "&nonce=" + encodeURIComponent(nonce);
        return url;
    };
    /**
     * @param {?=} timeout
     * @return {?}
     */
    OIDCAuthStrategy.prototype.refreshSession = function (timeout) {
        if (timeout === void 0) { timeout = 30000; }
        if (this.checkSessionIFrameUri)
            return this.iframe.navigate(this.checkSessionIFrameUri, timeout);
    };
    return OIDCAuthStrategy;
}(BaseAuthStrategy));
OIDCAuthStrategy = __decorate([
    Injectable(),
    __param(2, Inject(DOCUMENT)),
    __metadata("design:paramtypes", [Http,
        Router, Object, CheckSessionIFrame,
        BaseOAuthConfig])
], OIDCAuthStrategy);
export { OIDCAuthStrategy };
//# sourceMappingURL=D:/temp/angular-oauth2-oidc/src/oidc-auth-strategy.js.map
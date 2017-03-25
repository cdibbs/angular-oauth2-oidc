var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Http } from '@angular/http';
import { DOCUMENT } from '@angular/platform-browser';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BaseAuthStrategy } from './base-auth-strategy';
import { CheckSessionIFrame } from './check-session-iframe';
import { BaseOAuthConfig } from './models';
import { LogServiceToken } from './i';
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
     * @param {?} log
     */
    function OIDCAuthStrategy(http, router, document, iframe, _config, log) {
        var _this = _super.call(this, http, router, _config, document, log) || this;
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
        console.log("here we are");
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
export { OIDCAuthStrategy };
OIDCAuthStrategy.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
OIDCAuthStrategy.ctorParameters = function () { return [
    { type: Http, },
    { type: Router, },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] },] },
    { type: CheckSessionIFrame, },
    { type: BaseOAuthConfig, },
    { type: undefined, decorators: [{ type: Inject, args: [LogServiceToken,] },] },
]; };
function OIDCAuthStrategy_tsickle_Closure_declarations() {
    /** @type {?} */
    OIDCAuthStrategy.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    OIDCAuthStrategy.ctorParameters;
    /** @type {?} */
    OIDCAuthStrategy.prototype.http;
    /** @type {?} */
    OIDCAuthStrategy.prototype.router;
    /** @type {?} */
    OIDCAuthStrategy.prototype.document;
    /** @type {?} */
    OIDCAuthStrategy.prototype.iframe;
}
//# sourceMappingURL=C:/cygwin64/home/cdibbs/git/angular-oauth2-oidc/lib/oidc-auth-strategy.js.map
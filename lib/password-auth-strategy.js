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
import { Http, URLSearchParams, Headers } from '@angular/http';
import { DOCUMENT } from '@angular/platform-browser';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { BaseAuthStrategy } from './base-auth-strategy';
import { BaseOAuthConfig } from './models';
import { LogServiceToken } from './i';
/**
 * Represents an OIDC authentication strategy.
The OpenID Connect (OIDC) strategy can provide JWT-encoded roles and basic profile
information, as configured. More information can be found, here:
https://en.wikipedia.org/wiki/OpenID_Connect
 */
var PasswordAuthStrategy = (function (_super) {
    __extends(PasswordAuthStrategy, _super);
    /**
     * @param {?} http
     * @param {?} router
     * @param {?} _config
     * @param {?} document
     * @param {?} log
     */
    function PasswordAuthStrategy(http, router, _config, document, log) {
        var _this = _super.call(this, http, router, _config, document, log) || this;
        _this.http = http;
        _this.router = router;
        _this._config = _config;
        _this.document = document;
        _this.refreshLoaded$ = Observable.create(function (sender) {
            _this.refreshLoadedSender = sender;
        }).publish().connect();
        return _this;
    }
    Object.defineProperty(PasswordAuthStrategy.prototype, "kind", {
        /**
         * @return {?}
         */
        get: function () { return "password"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PasswordAuthStrategy.prototype, "loginUrl", {
        /**
         * @return {?}
         */
        get: function () { return this.fetchDocProp("authorization_endpoint", "fallbackLoginUri"); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PasswordAuthStrategy.prototype, "logoutUrl", {
        /**
         * @return {?}
         */
        get: function () { return this.fetchDocProp("end_session_endpoint", "fallbackLogoutUri"); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PasswordAuthStrategy.prototype, "tokenEndpoint", {
        /**
         * @return {?}
         */
        get: function () { return this.fetchDocProp("token_endpoint", "fallbackTokenEndpoint"); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PasswordAuthStrategy.prototype, "userinfoEndpoint", {
        /**
         * @return {?}
         */
        get: function () { return this.fetchDocProp("userinfo_endpoint", "fallbackUserInfoEndpoint"); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PasswordAuthStrategy.prototype, "issuer", {
        /**
         * @return {?}
         */
        get: function () { return this.fetchDocProp("issuer", "fallbackIssuer"); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PasswordAuthStrategy.prototype, "refreshes", {
        /**
         * @return {?}
         */
        get: function () { return this.refreshLoaded$; },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * @param {?=} options
     * @return {?}
     */
    PasswordAuthStrategy.prototype.initiateLoginFlow = function (options) {
        if (options === void 0) { options = null; }
        if (!options)
            throw new Error("The password flow requires a username and password provided through the options parameter.");
        if (options.autoLoadUserProfile || this.config.autoLoadUserProfile)
            return this.fetchTokenUsingPasswordFlowAndLoadUserProfile(options.Username, options.Password);
        return this.fetchTokenUsingPasswordFlow(options.Username, options.Password);
    };
    /**
     * @param {?} userName
     * @param {?} password
     * @return {?}
     */
    PasswordAuthStrategy.prototype.fetchTokenUsingPasswordFlowAndLoadUserProfile = function (userName, password) {
        var _this = this;
        return this
            .fetchTokenUsingPasswordFlow(userName, password)
            .then(function () { return _this.loadUserProfile(); });
    };
    /**
     * @param {?} userName
     * @param {?} password
     * @return {?}
     */
    PasswordAuthStrategy.prototype.fetchTokenUsingPasswordFlow = function (userName, password) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var /** @type {?} */ search = new URLSearchParams();
            search.set('grant_type', 'password');
            search.set('client_id', _this.config.clientId);
            search.set('scope', _this.config.scope);
            search.set('username', userName);
            search.set('password', password);
            if (_this.config.dummyClientSecret) {
                search.set('client_secret', _this.config.dummyClientSecret);
            }
            var /** @type {?} */ headers = new Headers();
            headers.set('Content-Type', 'application/x-www-form-urlencoded');
            var /** @type {?} */ params = search.toString();
            _this.http.post(_this.tokenEndpoint, params, { headers: headers }).map(function (r) { return r.json(); }).subscribe(function (tokenResponse) {
                _this.tokenReceived(moment());
                _this.log.debug('tokenResponse', tokenResponse);
                _this.storeAccessTokenResponse(tokenResponse.access_token, tokenResponse.refresh_token, tokenResponse.expires_in);
                resolve(tokenResponse);
            }, function (err) {
                _this.log.error('Error performing password flow', err);
                reject(err);
            });
        });
    };
    /**
     * @return {?}
     */
    PasswordAuthStrategy.prototype.loadUserProfile = function () {
        var _this = this;
        if (!this.hasValidAccessToken())
            throw Error("Can not load User Profile without access_token");
        return new Promise(function (resolve, reject) {
            var /** @type {?} */ headers = new Headers();
            headers.set('Authorization', 'Bearer ' + _this.getAccessToken());
            _this.http.get(_this.userinfoEndpoint, { headers: headers }).map(function (r) { return r.json(); }).subscribe(function (doc) {
                _this.log.debug('userinfo received', doc);
                _this.config.storage.setItem('id_token_claims_obj', JSON.stringify(doc));
                resolve(doc);
            }, function (err) {
                _this.log.error('error loading user info', err);
                reject(err);
            });
        });
    };
    /**
     * Uses a post to the configured refresh-token endpoint to maintain the user session.
    \@param {number} timeout The timeout for the request in milliseconds. Default: 30000ms.
     * @param {?=} timeout
     * @return {?}
     */
    PasswordAuthStrategy.prototype.refreshSession = function (timeout) {
        var _this = this;
        if (timeout === void 0) { timeout = 30000; }
        var /** @type {?} */ search = new URLSearchParams();
        search.set('grant_type', 'refresh_token');
        search.set('client_id', this.config.clientId);
        search.set('scope', this.config.scope);
        search.set('refresh_token', this.config.storage.getItem('refresh_token'));
        if (this.config.dummyClientSecret)
            search.set('client_secret', this.config.dummyClientSecret);
        var /** @type {?} */ headers = new Headers();
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        this.http.post(this.tokenEndpoint, search.toString(), /** @type {?} */ ({ headers: headers, search: search, }))
            .map(function (r) { return r.json(); })
            .subscribe(function (tokenResponse) {
            _this.log.debug('refresh tokenResponse', tokenResponse);
            _this.storeAccessTokenResponse(tokenResponse.access_token, tokenResponse.refresh_token, tokenResponse.expires_in);
            _this.refreshLoadedSender.next(tokenResponse);
        }, function (err) {
            _this.log.error('Error performing password flow', err);
            _this.refreshLoadedSender.error({ 'message': 'Error performing password flow refresh.', details: err });
        });
        return this.refreshLoaded$;
    };
    return PasswordAuthStrategy;
}(BaseAuthStrategy));
export { PasswordAuthStrategy };
PasswordAuthStrategy.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
PasswordAuthStrategy.ctorParameters = function () { return [
    { type: Http, },
    { type: Router, },
    { type: BaseOAuthConfig, },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [LogServiceToken,] },] },
]; };
function PasswordAuthStrategy_tsickle_Closure_declarations() {
    /** @type {?} */
    PasswordAuthStrategy.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    PasswordAuthStrategy.ctorParameters;
    /** @type {?} */
    PasswordAuthStrategy.prototype.refreshLoaded$;
    /** @type {?} */
    PasswordAuthStrategy.prototype.refreshLoadedSender;
    /** @type {?} */
    PasswordAuthStrategy.prototype.http;
    /** @type {?} */
    PasswordAuthStrategy.prototype.router;
    /** @type {?} */
    PasswordAuthStrategy.prototype._config;
    /** @type {?} */
    PasswordAuthStrategy.prototype.document;
}
//# sourceMappingURL=C:/cygwin64/home/cdibbs/git/angular-oauth2-oidc/lib/password-auth-strategy.js.map
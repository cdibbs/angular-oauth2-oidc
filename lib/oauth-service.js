import { Http } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { SelectedAuthStrategyToken } from './base-auth-strategy';
import { LogServiceToken } from './i';
import { BaseOAuthConfig } from './models';
var OAuthService = (function () {
    /**
     * @param {?} http
     * @param {?} _config
     * @param {?} _strategy
     * @param {?} log
     */
    function OAuthService(http, _config, _strategy, log) {
        var _this = this;
        this.http = http;
        this._config = _config;
        this._strategy = _strategy;
        this.state = '';
        this.tokenReceived = null;
        this._sessionEvents = null;
        this._sessionEvents = Observable
            .interval(30000)
            .flatMap(function () {
            var exp = moment(_this.strategy.getTokenExpiration(_this.idToken));
            var ttexp = moment.duration(exp.diff(moment()));
            var tslastRefreshed = moment.duration(moment().diff(_this.strategy.tokenReceived()));
            var tslastBumped = moment.duration(moment().diff(_this.lastBumped));
            //let durExp = "" + Math.floor(ttexp.asHours()) + moment.utc(ttexp.asMilliseconds()).format(":mm:ss");
            if (tslastBumped.asMinutes() < _this.config.userActivityWindow
                && tslastRefreshed.asMinutes() > _this.config.sessionRefreshInterval) {
                _this.refreshSession();
            }
            return Observable.from([{
                    tokenExpires: exp,
                    timeTilTokenExpires: ttexp,
                    timeSinceLastRefresh: tslastRefreshed,
                    timeSinceLastBumped: tslastBumped
                }]);
        });
        this.lastBumped = moment();
    }
    Object.defineProperty(OAuthService.prototype, "strategy", {
        /**
         * @return {?}
         */
        get: function () { return this._strategy; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(OAuthService.prototype, "config", {
        /**
         * @return {?}
         */
        get: function () { return this._config; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(OAuthService.prototype, "SessionEvents", {
        /**
         * @return {?}
         */
        get: function () { return this._sessionEvents; },
        enumerable: true,
        configurable: true
    });
    /**
     * Notify of a user interaction (for the sake of preserving a session).
     * @return {?}
     */
    OAuthService.prototype.bump = function () { this.lastBumped = moment(); };
    /**
     * @return {?}
     */
    OAuthService.prototype.initiateLoginFlow = function () { return this.strategy.initiateLoginFlow(); };
    /**
     * @return {?}
     */
    OAuthService.prototype.completeLoginFlow = function () { return this.strategy.completeLoginFlow(); };
    /**
     * @param {?=} fullUrl
     * @return {?}
     */
    OAuthService.prototype.loadDiscoveryDocument = function (fullUrl) { return this.strategy.loadDiscoveryDocument(fullUrl); };
    /**
     * @param {?=} timeout
     * @return {?}
     */
    OAuthService.prototype.refreshSession = function (timeout) { return this.strategy.refreshSession(timeout); };
    Object.defineProperty(OAuthService.prototype, "_window", {
        /**
         * @return {?}
         */
        get: function () { return window; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OAuthService.prototype, "identityClaims", {
        /**
         * @return {?}
         */
        get: function () { return this.strategy.identityClaims; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OAuthService.prototype, "idToken", {
        /**
         * @return {?}
         */
        get: function () { return this.strategy.decodeToken(this.idTokenRaw); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OAuthService.prototype, "idTokenRaw", {
        /**
         * @return {?}
         */
        get: function () { return this.strategy.getIdToken(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OAuthService.prototype, "accessToken", {
        /**
         * @return {?}
         */
        get: function () { return this.strategy.decodeToken(this.accessTokenRaw); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OAuthService.prototype, "accessTokenRaw", {
        /**
         * @return {?}
         */
        get: function () { return this.strategy.getAccessToken(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OAuthService.prototype, "isSessionExpired", {
        /**
         * @return {?}
         */
        get: function () {
            return this.strategy.isTokenExpired(this.idToken);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OAuthService.prototype, "sessionExpiration", {
        /**
         * @return {?}
         */
        get: function () {
            return this.strategy.getTokenExpiration(this.idToken);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OAuthService.prototype, "hasValidAccessToken", {
        /**
         * @return {?}
         */
        get: function () { return this.strategy.hasValidAccessToken(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OAuthService.prototype, "hasValidIdToken", {
        /**
         * @return {?}
         */
        get: function () { return this.strategy.hasValidIdToken(); },
        enumerable: true,
        configurable: true
    });
    /**
     * Logs out of the session by deleting our token storage. Optionally skips
    redirect, also. (warning: skipping the redirect means a user could still
    restart the session without re-entering the password, depending on the
    endpoint configuration).
    \@param {boolean} noRedirect Whether to skip the redirect. Defaults to false.
     * @param {?=} noRedirect
     * @return {?}
     */
    OAuthService.prototype.logOut = function (noRedirect) {
        if (noRedirect === void 0) { noRedirect = false; }
        this.strategy.logOut(noRedirect);
    };
    ;
    return OAuthService;
}());
export { OAuthService };
OAuthService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
OAuthService.ctorParameters = function () { return [
    { type: Http, },
    { type: BaseOAuthConfig, },
    { type: undefined, decorators: [{ type: Inject, args: [SelectedAuthStrategyToken,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [LogServiceToken,] },] },
]; };
function OAuthService_tsickle_Closure_declarations() {
    /** @type {?} */
    OAuthService.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    OAuthService.ctorParameters;
    /** @type {?} */
    OAuthService.prototype.options;
    /** @type {?} */
    OAuthService.prototype.state;
    /** @type {?} */
    OAuthService.prototype.validationHandler;
    /** @type {?} */
    OAuthService.prototype.dummyClientSecret;
    /** @type {?} */
    OAuthService.prototype.lastBumped;
    /** @type {?} */
    OAuthService.prototype.tokenReceived;
    /** @type {?} */
    OAuthService.prototype._sessionEvents;
    /** @type {?} */
    OAuthService.prototype.http;
    /** @type {?} */
    OAuthService.prototype._config;
    /** @type {?} */
    OAuthService.prototype._strategy;
}
//# sourceMappingURL=C:/cygwin64/home/cdibbs/git/angular-oauth2-oidc/lib/oauth-service.js.map
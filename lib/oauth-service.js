var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { JwtHelper } from 'angular2-jwt';
import { AuthStrategyFactory } from './auth-strategy-factory';
import { BaseOAuthConfig } from './models';
let OAuthService = class OAuthService {
    /**
     * @param {?} http
     * @param {?} _config
     * @param {?} jwt
     * @param {?} _strategyFactory
     */
    constructor(http, _config, jwt, _strategyFactory) {
        this.http = http;
        this._config = _config;
        this.jwt = jwt;
        this._strategyFactory = _strategyFactory;
        this._strategy = null;
        this.resource = '';
        this.state = '';
        this.tokenReceived = null;
        this._sessionEvents = null;
        this._sessionEvents = Observable
            .interval(1000)
            .flatMap(() => {
            var exp = moment(this.jwt.getTokenExpirationDate(this.idToken));
            var ttexp = moment.duration(exp.diff(moment()));
            var tslastRefreshed = moment.duration(moment().diff(this.strategy.tokenReceived()));
            var tslastBumped = moment.duration(moment().diff(this.lastBumped));
            //let durExp = "" + Math.floor(ttexp.asHours()) + moment.utc(ttexp.asMilliseconds()).format(":mm:ss");
            if (tslastBumped.asMinutes() < this.config.userActivityWindow
                && tslastRefreshed.asMinutes() > this.config.sessionRefreshInterval) {
                this.refreshSession();
            }
            return Observable.from([{
                    tokenExpires: exp,
                    timeTilTokenExpires: ttexp,
                    timeSinceLastRefresh: tslastRefreshed,
                    timeSinceLastBumped: tslastBumped
                }]);
        });
        this._strategy = _strategyFactory.get(this.config);
        this.lastBumped = moment();
    }
    /**
     * @return {?}
     */
    get strategy() { return this._strategy; }
    ;
    /**
     * @return {?}
     */
    get config() { return this._config; }
    ;
    /**
     * @return {?}
     */
    get SessionEvents() { return this._sessionEvents; }
    /**
     * Notify of a user interaction (for the sake of preserving a session).
     * @return {?}
     */
    bump() { this.lastBumped = moment(); }
    /**
     * @return {?}
     */
    initiateLoginFlow() { return this.strategy.initiateLoginFlow(); }
    /**
     * @return {?}
     */
    completeLoginFlow() { return this.strategy.completeLoginFlow(); }
    /**
     * @return {?}
     */
    refreshSession() { return this.strategy.refreshSession(); }
    /**
     * @return {?}
     */
    get _window() { return window; }
    /**
     * @return {?}
     */
    get identityClaims() { return this.strategy.identityClaims; }
    /**
     * @return {?}
     */
    get idToken() { return this.strategy.getIdToken(); }
    /**
     * @return {?}
     */
    get accessToken() { return this.strategy.getAccessToken(); }
    /**
     * @return {?}
     */
    get hasValidAccessToken() { return this.strategy.hasValidAccessToken(); }
    /**
     * @return {?}
     */
    get hasValidIdToken() { return this.strategy.hasValidIdToken(); }
    /**
     * Logs out of the session by deleting our token storage. Optionally skips
    redirect, also. (warning: skipping the redirect means a user could still
    restart the session without re-entering the password, depending on the
    endpoint configuration).
    \@param {boolean} noRedirect Whether to skip the redirect. Defaults to false.
     * @param {?=} noRedirect
     * @return {?}
     */
    logOut(noRedirect = false) { this.strategy.logOut(noRedirect); }
    ;
};
OAuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http,
        BaseOAuthConfig,
        JwtHelper,
        AuthStrategyFactory])
], OAuthService);
export { OAuthService };
function OAuthService_tsickle_Closure_declarations() {
    /** @type {?} */
    OAuthService.prototype._strategy;
    /** @type {?} */
    OAuthService.prototype.resource;
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
}
//# sourceMappingURL=C:/cygwin64/home/cdibbs/git/angular-oauth2-oidc/src/oauth-service.js.map
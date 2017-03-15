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
import { Http, URLSearchParams, Headers } from '@angular/http';
import { DOCUMENT } from '@angular/platform-browser';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { BaseAuthStrategy } from './base-auth-strategy';
import { BaseOAuthConfig } from './models';
/**
 * Represents an OIDC authentication strategy.
The OpenID Connect (OIDC) strategy can provide JWT-encoded roles and basic profile
information, as configured. More information can be found, here:
https://en.wikipedia.org/wiki/OpenID_Connect
 */
let PasswordAuthStrategy = class PasswordAuthStrategy extends BaseAuthStrategy {
    /**
     * @param {?} http
     * @param {?} router
     * @param {?} _config
     * @param {?} jwt
     * @param {?} document
     */
    constructor(http, router, _config, jwt, document) {
        super(http, router, _config, jwt, document);
        this.http = http;
        this.router = router;
        this._config = _config;
        this.jwt = jwt;
        this.document = document;
        this.refreshLoaded$ = Observable.create((sender) => {
            this.refreshLoadedSender = sender;
        }).publish().connect();
    }
    /**
     * @return {?}
     */
    get kind() { return "password"; }
    ;
    /**
     * @return {?}
     */
    get loginUrl() { return this.fetchDocProp("authorization_endpoint", "fallbackLoginUri"); }
    ;
    /**
     * @return {?}
     */
    get logoutUrl() { return this.fetchDocProp("end_session_endpoint", "fallbackLogoutUri"); }
    ;
    /**
     * @return {?}
     */
    get tokenEndpoint() { return this.fetchDocProp("token_endpoint", "fallbackTokenEndpoint"); }
    ;
    /**
     * @return {?}
     */
    get userinfoEndpoint() { return this.fetchDocProp("userinfo_endpoint", "fallbackUserInfoEndpoint"); }
    ;
    /**
     * @return {?}
     */
    get issuer() { return this.fetchDocProp("issuer", "fallbackIssuer"); }
    ;
    /**
     * @return {?}
     */
    get refreshes() { return this.refreshLoaded$; }
    ;
    /**
     * @param {?=} options
     * @return {?}
     */
    initiateLoginFlow(options = null) {
        if (!options)
            throw new Error("The password flow requires a username and password provided through the options parameter.");
        if (options.autoLoadUserProfile || this.config.autoLoadUserProfile)
            return this.fetchTokenUsingPasswordFlowAndLoadUserProfile(options.Username, options.Password);
        return this.fetchTokenUsingPasswordFlow(options.Username, options.Password);
    }
    /**
     * @param {?} userName
     * @param {?} password
     * @return {?}
     */
    fetchTokenUsingPasswordFlowAndLoadUserProfile(userName, password) {
        return this
            .fetchTokenUsingPasswordFlow(userName, password)
            .then(() => this.loadUserProfile());
    }
    /**
     * @param {?} userName
     * @param {?} password
     * @return {?}
     */
    fetchTokenUsingPasswordFlow(userName, password) {
        return new Promise((resolve, reject) => {
            let /** @type {?} */ search = new URLSearchParams();
            search.set('grant_type', 'password');
            search.set('client_id', this.config.clientId);
            search.set('scope', this.config.scope);
            search.set('username', userName);
            search.set('password', password);
            if (this.config.dummyClientSecret) {
                search.set('client_secret', this.config.dummyClientSecret);
            }
            let /** @type {?} */ headers = new Headers();
            headers.set('Content-Type', 'application/x-www-form-urlencoded');
            let /** @type {?} */ params = search.toString();
            this.http.post(this.tokenEndpoint, params, { headers }).map(r => r.json()).subscribe((tokenResponse) => {
                this.tokenReceived(moment());
                this.log.debug('tokenResponse', tokenResponse);
                this.storeAccessTokenResponse(tokenResponse.access_token, tokenResponse.refresh_token, tokenResponse.expires_in);
                resolve(tokenResponse);
            }, (err) => {
                this.log.error('Error performing password flow', err);
                reject(err);
            });
        });
    }
    /**
     * @return {?}
     */
    loadUserProfile() {
        if (!this.hasValidAccessToken())
            throw Error("Can not load User Profile without access_token");
        return new Promise((resolve, reject) => {
            let /** @type {?} */ headers = new Headers();
            headers.set('Authorization', 'Bearer ' + this.getAccessToken());
            this.http.get(this.userinfoEndpoint, { headers }).map(r => r.json()).subscribe((doc) => {
                this.log.debug('userinfo received', doc);
                this.config.storage.setItem('id_token_claims_obj', JSON.stringify(doc));
                resolve(doc);
            }, (err) => {
                this.log.error('error loading user info', err);
                reject(err);
            });
        });
    }
    /**
     * Uses a post to the configured refresh-token endpoint to maintain the user session.
    \@param {number} timeout The timeout for the request in milliseconds. Default: 30000ms.
     * @param {?=} timeout
     * @return {?}
     */
    refreshSession(timeout = 30000) {
        let /** @type {?} */ search = new URLSearchParams();
        search.set('grant_type', 'refresh_token');
        search.set('client_id', this.config.clientId);
        search.set('scope', this.config.scope);
        search.set('refresh_token', this.config.storage.getItem('refresh_token'));
        if (this.config.dummyClientSecret)
            search.set('client_secret', this.config.dummyClientSecret);
        let /** @type {?} */ headers = new Headers();
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        this.http.post(this.tokenEndpoint, search.toString(), /** @type {?} */ ({ headers: headers, search: search, }))
            .map(r => r.json())
            .subscribe((tokenResponse) => {
            this.log.debug('refresh tokenResponse', tokenResponse);
            this.storeAccessTokenResponse(tokenResponse.access_token, tokenResponse.refresh_token, tokenResponse.expires_in);
            this.refreshLoadedSender.next(tokenResponse);
        }, (err) => {
            this.log.error('Error performing password flow', err);
            this.refreshLoadedSender.error({ 'message': 'Error performing password flow refresh.', details: err });
        });
        return this.refreshLoaded$;
    }
};
PasswordAuthStrategy = __decorate([
    Injectable(),
    __param(4, Inject(DOCUMENT)),
    __metadata("design:paramtypes", [Http,
        Router,
        BaseOAuthConfig,
        JwtHelper, Object])
], PasswordAuthStrategy);
export { PasswordAuthStrategy };
function PasswordAuthStrategy_tsickle_Closure_declarations() {
    /** @type {?} */
    PasswordAuthStrategy.prototype.refreshLoaded$;
    /** @type {?} */
    PasswordAuthStrategy.prototype.refreshLoadedSender;
}
//# sourceMappingURL=D:/temp/angular-oauth2-oidc/src/password-auth-strategy.js.map
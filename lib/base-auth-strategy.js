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
import { Injectable, Inject, OpaqueToken } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/platform-browser';
import { JwtHelper } from 'angular2-jwt';
import { fromByteArray } from 'base64-js';
import sha256 from 'fast-sha256';
import * as nacl from 'tweetnacl-util';
import { BaseOAuthConfig, TokenValidationResult } from './models';
let BaseAuthStrategy = class BaseAuthStrategy {
    /**
     * @param {?} http
     * @param {?} router
     * @param {?} _config
     * @param {?} jwt
     * @param {?} document
     */
    constructor(http, router, _config, jwt, document) {
        this.http = http;
        this.router = router;
        this._config = _config;
        this.jwt = jwt;
        this.document = document;
        this.discoveryDocumentLoaded = false;
        this.now = new Date();
        this.discoveryDocumentLoaded$ = Observable.create(sender => {
            this.discoveryDocumentLoadedSender = sender;
        }).publish().connect();
    }
    /**
     * @return {?}
     */
    get kind() { return "base"; }
    ;
    /**
     * @return {?}
     */
    get config() { return (this._config); }
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
    get issuer() { return this.fetchDocProp("issuer", "fallbackIssuer"); }
    ;
    /**
     * @return {?}
     */
    get log() { return this.config.log; }
    ;
    /**
     * Fetch the specified discovery document propery, or fallback to a value specified in the config.
     * @param {?} prop
     * @param {?} fallbackKey
     * @return {?}
     */
    fetchDocProp(prop, fallbackKey) {
        return (this.discoveryDocumentLoaded && this._discoveryDoc[prop]) || this._config[fallbackKey];
    }
    /**
     * @param {?=} fullUrl
     * @return {?}
     */
    loadDiscoveryDocument(fullUrl = null) {
        return new Promise((resolve, reject) => {
            if (!fullUrl) {
                if (!this.config.fallbackIssuer)
                    reject("Must provide either fullUrl or and config.fallbackIssuer.");
                fullUrl = this.config.fallbackIssuer + '/.well-known/openid-configuration';
            }
            this.http.get(fullUrl).map(r => r.json()).subscribe((doc) => {
                this._discoveryDoc = doc;
                this.discoveryDocumentLoaded = true;
                this.discoveryDocumentLoadedSender.next(doc);
                resolve(doc);
            }, (err) => {
                this.log.error('error loading dicovery document', err);
                reject(err);
            });
        });
    }
    /**
     * @return {?}
     */
    initiateLoginFlow() {
        throw new Error("This must be implemented in derived classes.");
    }
    /**
     * @param {?=} timeout
     * @return {?}
     */
    refreshSession(timeout = 30000) {
        throw new Error("This must be implemented in derived classes.");
    }
    /**
     * @return {?}
     */
    getIdToken() { return this.config.storage.getItem("id_token"); }
    /**
     * @return {?}
     */
    getAccessToken() { return this.config.storage.getItem("access_token"); }
    ;
    /**
     * @return {?}
     */
    hasValidAccessToken() {
        if (this.getAccessToken()) {
            var /** @type {?} */ expiresAt = this.config.storage.getItem("expires_at");
            return !(expiresAt && parseInt(expiresAt) < this.now.getTime());
        }
        return false;
    }
    ;
    /**
     * @return {?}
     */
    hasValidIdToken() {
        if (this.getIdToken()) {
            var /** @type {?} */ expiresAt = this.config.storage.getItem("id_token_expires_at");
            return !(expiresAt && parseInt(expiresAt) < this.now.getTime());
        }
        return false;
    }
    ;
    /**
     * @return {?}
     */
    completeLoginFlow() {
        return new Promise((resolve, reject) => {
            let /** @type {?} */ parts = this.getFragment();
            let /** @type {?} */ accessToken = parts["access_token"];
            let /** @type {?} */ idToken = parts["id_token"];
            let /** @type {?} */ state = parts["state"];
            let /** @type {?} */ oidcSuccess = false;
            if (!accessToken || !state) {
                reject("Response didn't contain accessToken or state");
                return;
            }
            if (this.config.oidc && !idToken) {
                reject("Response didn't contain an idToken");
                return;
            }
            let /** @type {?} */ savedNonce = this.config.storage.getItem("nonce");
            let /** @type {?} */ stateParts = state.split(';');
            let /** @type {?} */ nonceInState = stateParts[0];
            if (savedNonce !== nonceInState) {
                reject("Nonce in response didn't match expected.");
                return;
            }
            this.storeAccessTokenResponse(accessToken, null, parseInt(parts['expires_in']));
            if (stateParts.length > 1)
                this.config.storage.setItem("state", stateParts[1]);
            let /** @type {?} */ validationResult = this.validateIdToken(idToken, accessToken);
            if (this.config.oidc && !validationResult.Valid) {
                reject(validationResult.Message);
                return;
            }
            if (this.config.clearHashAfterLogin)
                location.hash = '';
            resolve(this.jwt.decodeToken(idToken));
        });
    }
    ;
    /**
     * @param {?} idToken
     * @param {?} accessToken
     * @return {?}
     */
    validateIdToken(idToken, accessToken) {
        var /** @type {?} */ jwt = (this.jwt.decodeToken(idToken));
        var /** @type {?} */ savedNonce = this.config.storage.getItem("nonce");
        if (jwt.aud !== this.config.clientId) {
            return new TokenValidationResult(`Wrong audience: ${jwt.aud}`);
        }
        if (this.issuer && jwt.iss !== this.issuer) {
            return new TokenValidationResult(`Wrong issuer: ${jwt.iss}`);
        }
        if (jwt.nonce !== savedNonce) {
            return new TokenValidationResult(`Wrong nonce: ${jwt.nonce}`);
        }
        if (accessToken && !this.checkAtHash(accessToken, jwt)) {
            return new TokenValidationResult("Wrong at_hash");
        }
        if (this.jwt.isTokenExpired(idToken)) {
            return new TokenValidationResult("Token has expired.");
        }
        this.config.storage.setItem("id_token", idToken);
        this.config.storage.setItem("id_token_claims_obj", idToken);
        this.config.storage.setItem("id_token_expires_at", "" + this.jwt.getTokenExpirationDate(idToken));
        return TokenValidationResult.Ok;
    }
    /**
     * @return {?}
     */
    get identityClaims() {
        var /** @type {?} */ claims = this.config.storage.getItem("id_token_claims_obj");
        if (!claims)
            return null;
        return JSON.parse(claims);
    }
    ;
    /**
     * @param {?=} extraState
     * @param {?=} nonce
     * @return {?}
     */
    createLoginUrl(extraState = null, nonce = null) {
        nonce = nonce || this.createAndSaveNonce();
        let /** @type {?} */ state = extraState ? nonce + ";" + extraState : nonce;
        let /** @type {?} */ response_type = this.config.oidc ? "id_token+token" : "token";
        var /** @type {?} */ url = this.loginUrl
            + "?response_type="
            + response_type
            + "&client_id="
            + encodeURIComponent(this.config.clientId)
            + "&state="
            + encodeURIComponent(state)
            + "&redirect_uri="
            + encodeURIComponent(this.config.redirectUri)
            + "&scope="
            + encodeURIComponent(this.config.scope);
        if (this.config.resource) {
            url += "&resource=" + encodeURIComponent(this.config.resource);
        }
        return url;
    }
    ;
    /**
     * @return {?}
     */
    createAndSaveNonce() {
        var /** @type {?} */ nonce = "";
        const /** @type {?} */ possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var /** @type {?} */ i = 0; i < 40; i++)
            nonce += possible.charAt(Math.floor(Math.random() * possible.length));
        this.config.storage.setItem("nonce", nonce);
        return nonce;
    }
    ;
    /**
     * @param {?=} noRedirect
     * @return {?}
     */
    logOut(noRedirect = false) {
        var /** @type {?} */ id_token = this.getIdToken();
        this.config.storage.removeItem("access_token");
        this.config.storage.removeItem("id_token");
        this.config.storage.removeItem("refresh_token");
        this.config.storage.removeItem("nonce");
        this.config.storage.removeItem("expires_at");
        this.config.storage.removeItem("id_token_claims_obj");
        this.config.storage.removeItem("id_token_expires_at");
        if (!this.logoutUrl || noRedirect)
            return;
        let /** @type {?} */ logoutUrl = this.logoutUrl + "?id_token="
            + encodeURIComponent(id_token)
            + "&redirect_uri="
            + encodeURIComponent(this.config.redirectUri);
        this.router.navigateByUrl(logoutUrl);
    }
    ;
    /**
     * @return {?}
     */
    getFragment() {
        if (this.document.location.hash.indexOf("#") === 0) {
            return this.parseQueryString(this.document.location.hash.substr(1));
        }
        else {
            return {};
        }
    }
    ;
    /**
     * @param {?} queryString
     * @return {?}
     */
    parseQueryString(queryString) {
        var /** @type {?} */ data = {}, /** @type {?} */ pairs, /** @type {?} */ pair, /** @type {?} */ separatorIndex, /** @type {?} */ escapedKey, /** @type {?} */ escapedValue, /** @type {?} */ key, /** @type {?} */ value;
        if (queryString === null)
            return data;
        pairs = queryString.split("&");
        for (var /** @type {?} */ i = 0; i < pairs.length; i++) {
            pair = pairs[i];
            separatorIndex = pair.indexOf("=");
            if (separatorIndex === -1) {
                escapedKey = pair;
                escapedValue = null;
            }
            else {
                escapedKey = pair.substr(0, separatorIndex);
                escapedValue = pair.substr(separatorIndex + 1);
            }
            key = decodeURIComponent(escapedKey);
            value = decodeURIComponent(escapedValue);
            if (key.substr(0, 1) === '/')
                key = key.substr(1);
            data[key] = value;
        }
        return data;
    }
    ;
    /**
     * @param {?} accessToken
     * @param {?} refreshToken
     * @param {?} expiresIn
     * @return {?}
     */
    storeAccessTokenResponse(accessToken, refreshToken, expiresIn) {
        this.config.storage.setItem("access_token", accessToken);
        if (expiresIn) {
            var /** @type {?} */ expiresInMilliSeconds = expiresIn * 1000;
            var /** @type {?} */ now = new Date();
            var /** @type {?} */ expiresAt = now.getTime() + expiresInMilliSeconds;
            this.config.storage.setItem("expires_at", "" + expiresAt);
        }
        if (refreshToken) {
            this.config.storage.setItem("refresh_token", refreshToken);
        }
    }
    /**
     * @param {?} accessToken
     * @param {?} idClaims
     * @return {?}
     */
    checkAtHash(accessToken, idClaims) {
        if (!accessToken || !idClaims || !idClaims.at_hash)
            return true;
        var /** @type {?} */ tokenHash = sha256(nacl.decodeUTF8(accessToken));
        var /** @type {?} */ leftMostHalf = tokenHash.slice(0, (tokenHash.length / 2));
        var /** @type {?} */ tokenHashBase64 = fromByteArray(leftMostHalf);
        var /** @type {?} */ atHash = tokenHashBase64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
        var /** @type {?} */ claimsAtHash = idClaims.at_hash.replace(/=/g, "");
        var /** @type {?} */ atHash = tokenHashBase64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
        if (atHash != claimsAtHash) {
            this.log.warn("exptected at_hash: " + atHash);
            this.log.warn("actual at_hash: " + claimsAtHash);
        }
        return (atHash == claimsAtHash);
    }
};
BaseAuthStrategy = __decorate([
    Injectable(),
    __param(4, Inject(DOCUMENT)),
    __metadata("design:paramtypes", [Http,
        Router,
        BaseOAuthConfig,
        JwtHelper, Object])
], BaseAuthStrategy);
export { BaseAuthStrategy };
function BaseAuthStrategy_tsickle_Closure_declarations() {
    /** @type {?} */
    BaseAuthStrategy.prototype._discoveryDoc;
    /** @type {?} */
    BaseAuthStrategy.prototype.discoveryDocumentLoadedSender;
    /** @type {?} */
    BaseAuthStrategy.prototype.discoveryDocumentLoaded;
    /** @type {?} */
    BaseAuthStrategy.prototype.discoveryDocumentLoaded$;
    /** @type {?} */
    BaseAuthStrategy.prototype.now;
}
export let /** @type {?} */ AuthStrategyToken = new OpaqueToken("AuthStrategy");
//# sourceMappingURL=C:/cygwin64/home/cdibbs/git/angular-oauth2-oidc/src/base-auth-strategy.js.map
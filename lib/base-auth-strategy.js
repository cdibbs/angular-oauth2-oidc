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
import { DOCUMENT } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { fromByteArray } from 'base64-js';
import sha256 from 'fast-sha256';
import * as nacl from 'tweetnacl-util';
import { BaseOAuthConfig, TokenValidationResult } from './models';
import { LogServiceToken } from './i';
var BaseAuthStrategy = (function () {
    /**
     * @param {?} http
     * @param {?} router
     * @param {?} _config
     * @param {?} document
     * @param {?} log
     */
    function BaseAuthStrategy(http, router, _config, document, log) {
        var _this = this;
        this.http = http;
        this.router = router;
        this._config = _config;
        this.document = document;
        this.log = log;
        this.discoveryDocumentLoaded = false;
        this.now = new Date();
        this.discoveryDocumentLoaded$ = Observable.create(function (sender) {
            _this.discoveryDocumentLoadedSender = sender;
        }).publish().connect();
    }
    /**
     * @param {?=} m
     * @return {?}
     */
    BaseAuthStrategy.prototype.tokenReceived = function (m) {
        if (m)
            this.config.storage.setItem("tokenReceived", m.toISOString());
        var /** @type {?} */ rec = this.config.storage.getItem("tokenReceived");
        return rec ? moment(rec) : null;
    };
    Object.defineProperty(BaseAuthStrategy.prototype, "kind", {
        /**
         * @return {?}
         */
        get: function () { return "base"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(BaseAuthStrategy.prototype, "config", {
        /**
         * @return {?}
         */
        get: function () { return (this._config); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(BaseAuthStrategy.prototype, "loginUrl", {
        /**
         * @return {?}
         */
        get: function () { return this.fetchDocProp("authorization_endpoint", "fallbackLoginUri"); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(BaseAuthStrategy.prototype, "logoutUrl", {
        /**
         * @return {?}
         */
        get: function () { return this.fetchDocProp("end_session_endpoint", "fallbackLogoutUri"); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(BaseAuthStrategy.prototype, "issuer", {
        /**
         * @return {?}
         */
        get: function () { return this.fetchDocProp("issuer", "fallbackIssuer"); },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * Fetch the specified discovery document propery, or fallback to a value specified in the config.
     * @param {?} prop
     * @param {?} fallbackKey
     * @return {?}
     */
    BaseAuthStrategy.prototype.fetchDocProp = function (prop, fallbackKey) {
        return (this.discoveryDocumentLoaded && this._discoveryDoc[prop]) || ((this._config))[fallbackKey];
    };
    /**
     * @param {?=} fullUrl
     * @return {?}
     */
    BaseAuthStrategy.prototype.loadDiscoveryDocument = function (fullUrl) {
        var _this = this;
        if (fullUrl === void 0) { fullUrl = null; }
        console.log("Here are the URLs", fullUrl, this.config.fallbackIssuer, this.config);
        return new Promise(function (resolve, reject) {
            if (!fullUrl) {
                if (!_this.config.fallbackIssuer)
                    reject("Must provide either fullUrl parameter or a config.fallbackIssuer.");
                fullUrl = _this.config.fallbackIssuer + "/.well-known/openid-configuration";
            }
            console.log("computed url", fullUrl);
            _this.http.get(fullUrl).map(function (r) { return r.json(); }).subscribe(function (doc) {
                _this._discoveryDoc = doc;
                _this.discoveryDocumentLoaded = true;
                _this.discoveryDocumentLoadedSender.next(doc);
                resolve(doc);
            }, function (err) {
                _this.log.error('error loading dicovery document', err);
                reject(err);
            });
        });
    };
    /**
     * @return {?}
     */
    BaseAuthStrategy.prototype.initiateLoginFlow = function () {
        throw new Error("This must be implemented in derived classes.");
    };
    /**
     * @param {?=} timeout
     * @return {?}
     */
    BaseAuthStrategy.prototype.refreshSession = function (timeout) {
        if (timeout === void 0) { timeout = 30000; }
        throw new Error("This must be implemented in derived classes.");
    };
    /**
     * @return {?}
     */
    BaseAuthStrategy.prototype.getIdToken = function () { return this.config.storage.getItem("id_token"); };
    /**
     * @return {?}
     */
    BaseAuthStrategy.prototype.getAccessToken = function () { return this.config.storage.getItem("access_token"); };
    ;
    /**
     * @return {?}
     */
    BaseAuthStrategy.prototype.hasValidAccessToken = function () {
        if (this.getAccessToken()) {
            var /** @type {?} */ expiresAt = this.config.storage.getItem("expires_at");
            return !(expiresAt && parseInt(expiresAt) < this.now.getTime());
        }
        return false;
    };
    ;
    /**
     * @return {?}
     */
    BaseAuthStrategy.prototype.hasValidIdToken = function () {
        if (this.getIdToken()) {
            var /** @type {?} */ expiresAt = this.config.storage.getItem("id_token_expires_at");
            return !(expiresAt && parseInt(expiresAt) < this.now.getTime());
        }
        return false;
    };
    ;
    /**
     * @return {?}
     */
    BaseAuthStrategy.prototype.completeLoginFlow = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.tokenReceived(moment());
            var /** @type {?} */ parts = _this.getFragment();
            var /** @type {?} */ accessToken = parts["access_token"];
            var /** @type {?} */ idToken = parts["id_token"];
            var /** @type {?} */ state = parts["state"];
            var /** @type {?} */ oidcSuccess = false;
            if (!accessToken || !state) {
                reject("Response didn't contain accessToken or state");
                return;
            }
            if (_this.config.oidc && !idToken) {
                reject("Response didn't contain an idToken");
                return;
            }
            var /** @type {?} */ savedNonce = _this.config.storage.getItem("nonce");
            var /** @type {?} */ stateParts = state.split(';');
            var /** @type {?} */ nonceInState = stateParts[0];
            if (savedNonce !== nonceInState) {
                reject("Nonce in response didn't match expected.");
                return;
            }
            _this.storeAccessTokenResponse(accessToken, null, parseInt(parts['expires_in']));
            if (stateParts.length > 1)
                _this.config.storage.setItem("state", stateParts[1]);
            var /** @type {?} */ validationResult = _this.validateIdToken(idToken, accessToken);
            if (_this.config.oidc && !validationResult.Valid) {
                reject(validationResult.Message);
                return;
            }
            if (_this.config.clearHashAfterLogin)
                location.hash = '';
            resolve(_this.decodeToken(idToken));
        });
    };
    ;
    /**
     * @param {?} idToken
     * @param {?} accessToken
     * @return {?}
     */
    BaseAuthStrategy.prototype.validateIdToken = function (idToken, accessToken) {
        var /** @type {?} */ jwt = (this.decodeToken(idToken));
        var /** @type {?} */ savedNonce = this.config.storage.getItem("nonce");
        if (jwt.aud !== this.config.clientId) {
            return new TokenValidationResult("Wrong audience: " + jwt.aud);
        }
        if (this.issuer && jwt.iss !== this.issuer) {
            return new TokenValidationResult("Wrong issuer: " + jwt.iss);
        }
        if (jwt.nonce !== savedNonce) {
            return new TokenValidationResult("Wrong nonce: " + jwt.nonce);
        }
        if (accessToken && !this.checkAtHash(accessToken, jwt)) {
            return new TokenValidationResult("Wrong at_hash");
        }
        if (this.isTokenExpired(idToken)) {
            return new TokenValidationResult("Token has expired.");
        }
        this.config.storage.setItem("id_token", idToken);
        this.config.storage.setItem("id_token_claims_obj", idToken);
        this.config.storage.setItem("id_token_expires_at", "" + this.getTokenExpiration(idToken));
        return TokenValidationResult.Ok;
    };
    Object.defineProperty(BaseAuthStrategy.prototype, "identityClaims", {
        /**
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ claims = this.config.storage.getItem("id_token_claims_obj");
            if (!claims)
                return null;
            return JSON.parse(claims);
        },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * @param {?=} extraState
     * @param {?=} nonce
     * @return {?}
     */
    BaseAuthStrategy.prototype.createLoginUrl = function (extraState, nonce) {
        if (extraState === void 0) { extraState = null; }
        if (nonce === void 0) { nonce = null; }
        nonce = nonce || this.createAndSaveNonce();
        var /** @type {?} */ state = extraState ? nonce + ";" + extraState : nonce;
        var /** @type {?} */ response_type = this.config.oidc ? "id_token+token" : "token";
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
    };
    ;
    /**
     * @return {?}
     */
    BaseAuthStrategy.prototype.createAndSaveNonce = function () {
        var /** @type {?} */ nonce = "";
        var /** @type {?} */ possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var /** @type {?} */ i = 0; i < 40; i++)
            nonce += possible.charAt(Math.floor(Math.random() * possible.length));
        this.config.storage.setItem("nonce", nonce);
        return nonce;
    };
    ;
    /**
     * @param {?=} noRedirect
     * @return {?}
     */
    BaseAuthStrategy.prototype.logOut = function (noRedirect) {
        var _this = this;
        if (noRedirect === void 0) { noRedirect = false; }
        if (this.config.useDiscovery && !this.discoveryDocumentLoaded) {
            this.loadDiscoveryDocument().then(function (d) {
                _this._logOut(noRedirect);
            });
        }
        else {
            this._logOut(noRedirect);
        }
    };
    /**
     * @param {?=} noRedirect
     * @return {?}
     */
    BaseAuthStrategy.prototype._logOut = function (noRedirect) {
        if (noRedirect === void 0) { noRedirect = false; }
        var /** @type {?} */ id_token = this.getIdToken();
        this.config.storage.removeItem("access_token");
        this.config.storage.removeItem("id_token");
        this.config.storage.removeItem("refresh_token");
        this.config.storage.removeItem("nonce");
        this.config.storage.removeItem("expires_at");
        this.config.storage.removeItem("id_token_claims_obj");
        this.config.storage.removeItem("id_token_expires_at");
        if (!noRedirect) {
            if (!this.logoutUrl) {
                this.log.warn("No logout URL specified.");
            }
            return;
        }
        this.log.debug(this.logoutUrl);
        var /** @type {?} */ logoutUrl = this.logoutUrl + "?id_token="
            + encodeURIComponent(id_token)
            + "&redirect_uri="
            + encodeURIComponent(this.config.redirectUri);
        this.log.debug(logoutUrl);
        this.router.navigateByUrl(logoutUrl);
    };
    ;
    /**
     * @param {?} rawToken
     * @return {?}
     */
    BaseAuthStrategy.prototype.decodeToken = function (rawToken) {
        try {
            var /** @type {?} */ parts = rawToken.split(".");
            var /** @type {?} */ raw = this.base64Decode(parts[1]);
            var /** @type {?} */ json = JSON.parse(raw);
            return json;
        }
        catch (err) {
            this.log.warn("Error decoding token.", err, rawToken);
            return null;
        }
    };
    /**
     * @param {?} token
     * @param {?=} offsetSeconds
     * @return {?}
     */
    BaseAuthStrategy.prototype.isTokenExpired = function (token, offsetSeconds) {
        if (offsetSeconds === void 0) { offsetSeconds = 0; }
        var /** @type {?} */ date = this.getTokenExpiration(token);
        if (date == null) {
            return false;
        }
        // Token expired?
        return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    };
    /**
     * @param {?} decoded
     * @return {?}
     */
    BaseAuthStrategy.prototype.getTokenExpiration = function (decoded) {
        if (!decoded || !decoded.hasOwnProperty('exp')) {
            return null;
        }
        var /** @type {?} */ date = new Date(0); // The 0 here is the key, which sets the date to the epoch
        date.setUTCSeconds(decoded.exp);
        return date;
    };
    /**
     * @param {?} t
     * @return {?}
     */
    BaseAuthStrategy.prototype.decodeUnicode = function (t) {
        var /** @type {?} */ d = atob(t);
        return decodeURIComponent(Array.prototype.map.call(d, function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    };
    /**
     * @param {?} t
     * @return {?}
     */
    BaseAuthStrategy.prototype.base64Decode = function (t) {
        var /** @type {?} */ output = t.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: {
                break;
            }
            case 2: {
                output += '==';
                break;
            }
            case 3: {
                output += '=';
                break;
            }
            default: {
                throw 'Illegal base64url string!';
            }
        }
        return atob(output);
    };
    /**
     * @return {?}
     */
    BaseAuthStrategy.prototype.getFragment = function () {
        if (this.document.location.hash.indexOf("#") === 0) {
            return this.parseQueryString(this.document.location.hash.substr(1));
        }
        else {
            return {};
        }
    };
    ;
    /**
     * @param {?} queryString
     * @return {?}
     */
    BaseAuthStrategy.prototype.parseQueryString = function (queryString) {
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
    };
    ;
    /**
     * @param {?} accessToken
     * @param {?} refreshToken
     * @param {?} expiresIn
     * @return {?}
     */
    BaseAuthStrategy.prototype.storeAccessTokenResponse = function (accessToken, refreshToken, expiresIn) {
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
    };
    /**
     * @param {?} accessToken
     * @param {?} idClaims
     * @return {?}
     */
    BaseAuthStrategy.prototype.checkAtHash = function (accessToken, idClaims) {
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
    };
    return BaseAuthStrategy;
}());
BaseAuthStrategy = __decorate([
    Injectable(),
    __param(3, Inject(DOCUMENT)),
    __param(4, Inject(LogServiceToken)),
    __metadata("design:paramtypes", [Http,
        Router,
        BaseOAuthConfig, Object, Object])
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
export var /** @type {?} */ AuthStrategyToken = new OpaqueToken("AuthStrategy");
export var /** @type {?} */ SelectedAuthStrategyToken = new OpaqueToken("SelectedAuthStrategy");
//# sourceMappingURL=D:/temp/angular-oauth2-oidc/src/base-auth-strategy.js.map
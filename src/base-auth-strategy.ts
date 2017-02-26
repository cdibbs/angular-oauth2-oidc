import { Http, URLSearchParams, Headers, Request } from '@angular/http';
import { Injectable, Inject, OpaqueToken } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { DOCUMENT } from '@angular/platform-browser';
import { JwtHelper } from 'angular2-jwt';

import {Base64} from 'js-base64';
import {fromByteArray} from 'base64-js';
import sha256 from 'fast-sha256';
import * as nacl from 'tweetnacl-util';

import { DiscoveryDocument, BaseOAuthConfig, TokenValidationResult } from './models';
import { IJWT } from './models/i';
import { IAuthStrategy, ILogService } from './i';

@Injectable()
export class BaseAuthStrategy<TConfig extends BaseOAuthConfig> implements IAuthStrategy {
    protected _discoveryDoc: DiscoveryDocument;
    protected discoveryDocumentLoadedSender: Observer<any>;
    public discoveryDocumentLoaded: boolean = false;
    public discoveryDocumentLoaded$: Observable<any>;
    public now: Date = new Date();
    public get kind(): string { return "base" };

    // FIXME: At the time of writing (2017-02-12), NGC did not support generic parameters in injectable constructors.
    // For this reason, _config uses the base class rather than TConfig.
    public constructor(
        protected http: Http,
        protected router: Router,
        protected _config: BaseOAuthConfig,
        protected jwt: JwtHelper,
        @Inject(DOCUMENT) protected document: any) {
        this.discoveryDocumentLoaded$ = Observable.create(sender => {
            this.discoveryDocumentLoadedSender = sender;
        }).publish().connect();
    }

    public get config(): TConfig { return this._config as TConfig; };
    public get loginUrl(): string { return this.fetchDocProp("authorization_endpoint", "fallbackLoginUri"); };
    public get logoutUrl(): string { return this.fetchDocProp("end_session_endpoint", "fallbackLogoutUri"); };
    public get issuer(): string { return this.fetchDocProp("issuer", "fallbackIssuer"); };

    protected get log(): ILogService { return this.config.log; };

    /**
     * Fetch the specified discovery document propery, or fallback to a value specified in the config.
     */
    protected fetchDocProp(prop: string, fallbackKey: string): string {
        return (this.discoveryDocumentLoaded && this._discoveryDoc[prop]) || this._config[fallbackKey];
    }

    loadDiscoveryDocument(fullUrl: string = null): Promise<DiscoveryDocument> {
        return new Promise((resolve, reject) => {
            if (!fullUrl) {
                if (! this.config.fallbackIssuer)
                    reject("Must provide either fullUrl or and config.fallbackIssuer.");
                fullUrl = this.config.fallbackIssuer + '/.well-known/openid-configuration';
            }

            this.http.get(fullUrl).map(r => r.json()).subscribe(
                (doc: DiscoveryDocument) => {
                    this._discoveryDoc = doc;
                    this.discoveryDocumentLoaded = true;
                    this.discoveryDocumentLoadedSender.next(doc);
                    resolve(doc);
                },
                (err) => {
                    this.log.error('error loading dicovery document', err);
                    reject(err);
                }
            );
        });
    }

    public initiateLoginFlow(): Promise<any> {
        throw new Error("This must be implemented in derived classes.");
    }

    public refreshSession(timeout: number = 30000): Observable<any> {
        throw new Error("This must be implemented in derived classes.");
    }

    getIdToken(): string { return this.config.storage.getItem("id_token"); }  
    getAccessToken(): string { return this.config.storage.getItem("access_token"); };

    hasValidAccessToken(): boolean {
        if (this.getAccessToken()) {
            var expiresAt = this.config.storage.getItem("expires_at");
            return !(expiresAt && parseInt(expiresAt) < this.now.getTime());
        }
        return false;
    };
    
    hasValidIdToken(): boolean {
        if (this.getIdToken()) {
            var expiresAt = this.config.storage.getItem("id_token_expires_at");
            return !(expiresAt && parseInt(expiresAt) < this.now.getTime())
        }
        return false;
    };

    public completeLoginFlow(): Promise<IJWT> {        
        return new Promise((resolve, reject) => {     
            let parts = this.getFragment();
            let accessToken = parts["access_token"];
            let idToken = parts["id_token"];
            let state = parts["state"];        
            let oidcSuccess = false;

            if (!accessToken || !state) {
                reject("Response didn't contain accessToken or state");
                return;
            }

            if (this.config.oidc && !idToken) {
                reject("Response didn't contain an idToken");
                return;
            }

            let savedNonce = this.config.storage.getItem("nonce");
            let stateParts = state.split(';');
            let nonceInState = stateParts[0];

            if (savedNonce !== nonceInState) {            
                reject("Nonce in response didn't match expected.");
                return;
            }        

            this.storeAccessTokenResponse(accessToken, null, parseInt(parts['expires_in']));
            if (stateParts.length > 1)
                this.config.storage.setItem("state", stateParts[1]);

            let validationResult = this.validateIdToken(idToken, accessToken);
            if (this.config.oidc && !validationResult.Valid) {
                reject(validationResult.Message);
                return;
            }
                  
            if (this.config.clearHashAfterLogin) location.hash = '';        
            resolve(this.jwt.decodeToken(idToken));
        });
    };
    
    validateIdToken(idToken, accessToken): TokenValidationResult {
        var jwt = this.jwt.decodeToken(idToken) as IJWT;
        var savedNonce = this.config.storage.getItem("nonce");
        
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

    public get identityClaims(): string {
        var claims = this.config.storage.getItem("id_token_claims_obj");
        if (!claims) return null;
        return JSON.parse(claims);
    };

    protected createLoginUrl(extraState: string = null, nonce: string = null): string {
        nonce = nonce || this.createAndSaveNonce();
        let state = extraState ? nonce + ";" + extraState : nonce;
        let response_type = this.config.oidc ? "id_token+token" : "token";

        var url = this.loginUrl 
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

    protected createAndSaveNonce(): string {
        var nonce = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 40; i++)
            nonce += possible.charAt(Math.floor(Math.random() * possible.length));    

        this.config.storage.setItem("nonce", nonce);
        return nonce;
    };

    public logOut(noRedirect: boolean = false): void {
        var id_token = this.getIdToken();
        this.config.storage.removeItem("access_token");
        this.config.storage.removeItem("id_token");
        this.config.storage.removeItem("refresh_token");
        this.config.storage.removeItem("nonce");
        this.config.storage.removeItem("expires_at");
        this.config.storage.removeItem("id_token_claims_obj");
        this.config.storage.removeItem("id_token_expires_at");
        
        if (!this.logoutUrl || noRedirect) return;

        let logoutUrl: string = 
            this.logoutUrl + "?id_token=" 
                + encodeURIComponent(id_token)
                + "&redirect_uri="
                + encodeURIComponent(this.config.redirectUri);
        this.router.navigateByUrl(logoutUrl);
    };

    protected getFragment(): { [key: string]: string } {
        if (this.document.location.hash.indexOf("#") === 0) {
            return this.parseQueryString(this.document.location.hash.substr(1));
        } else {
            return {};
        }
    };

    protected parseQueryString(queryString): { [key: string]: string } {
        var data = {}, pairs, pair, separatorIndex, escapedKey, escapedValue, key, value;

        if (queryString === null) return data;
            
        pairs = queryString.split("&");
        for (var i = 0; i < pairs.length; i++) {
            pair = pairs[i];
            separatorIndex = pair.indexOf("=");

            if (separatorIndex === -1) {
                escapedKey = pair;
                escapedValue = null;
            } else {
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

    protected storeAccessTokenResponse(accessToken: string, refreshToken: string, expiresIn: number): void {
        this.config.storage.setItem("access_token", accessToken);

        if (expiresIn) {
            var expiresInMilliSeconds = expiresIn * 1000;
            var now = new Date();
            var expiresAt = now.getTime() + expiresInMilliSeconds;
            this.config.storage.setItem("expires_at", "" + expiresAt);
        }

        if (refreshToken) {
            this.config.storage.setItem("refresh_token", refreshToken);
        }
    }

    protected checkAtHash(accessToken: string, idClaims): boolean {
        if (!accessToken || !idClaims || !idClaims.at_hash ) return true;
        var tokenHash: Uint8Array = sha256(nacl.decodeUTF8(accessToken));
        var leftMostHalf = tokenHash.slice(0, (tokenHash.length/2));
        var tokenHashBase64 = fromByteArray(leftMostHalf);
        var atHash = tokenHashBase64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
        var claimsAtHash = idClaims.at_hash.replace(/=/g, "");
        
        var atHash = tokenHashBase64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

        if (atHash != claimsAtHash) {
            this.log.warn("exptected at_hash: " + atHash);    
            this.log.warn("actual at_hash: " + claimsAtHash);
        }       
        return (atHash == claimsAtHash);
    }    
}

export let AuthStrategyToken = new OpaqueToken("AuthStrategy");
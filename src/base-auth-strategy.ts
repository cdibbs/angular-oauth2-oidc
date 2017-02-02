import { Http, URLSearchParams, Headers, Request } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';

import {Base64} from 'js-base64';
import {fromByteArray} from 'base64-js';
import sha256 from 'fast-sha256';
import * as nacl from 'tweetnacl-util';

import { DiscoveryDocument, BaseOAuthConfig } from './models';
import { IAuthStrategy } from './i';

@Injectable()
export class BaseAuthStrategy<TConfig extends BaseOAuthConfig> implements IAuthStrategy {
    protected _discoveryDoc: DiscoveryDocument;
    protected discoveryDocumentLoadedSender: Observer<any>;
    public discoveryDocumentLoaded: boolean = false;
    public discoveryDocumentLoaded$: Observable<any>;
    public now: Date = new Date();

    public constructor(protected http: Http, protected router: Router, protected _config: TConfig) {
        this.discoveryDocumentLoaded$ = Observable.create(sender => {
            this.discoveryDocumentLoadedSender = sender;
        }).publish().connect();
    }

    public get config(): TConfig { return this._config; };
    public get loginUrl(): string { return this.fetchDocProp("authorization_endpoint", "fallbackLoginUri"); };
    public get logoutUrl(): string { return this.fetchDocProp("end_session_endpoint", "fallbackLogoutUri"); };

    /**
     * Fetch the specified discovery document propery, or fallback to a value specified in the config.
     */
    protected fetchDocProp(prop: string, fallbackKey: string): string {
        return (this.discoveryDocumentLoaded && this._discoveryDoc["prop"]) || this._config[fallbackKey];
    }

    loadDiscoveryDocument(fullUrl: string = null): Promise<any> {
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
                    console.error('error loading dicovery document', err);
                    reject(err);
                }
            );
        });
    }

    public initiateLoginFlow(): Promise<any> {
        throw new Error("This must be implemented in derived classes.");
    }

    public refreshSession(): Promise<any> {
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

    protected getIdentityClaims(): any {
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
            url += "&resource=" + encodeURIComponent(this.resource);
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

    protected logOut(noRedirect: boolean = false): void {
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
        if (window.location.hash.indexOf("#") === 0) {
            return this.parseQueryString(window.location.hash.substr(1));
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
            console.warn("exptected at_hash: " + atHash);    
            console.warn("actual at_hash: " + claimsAtHash);
        }       
        return (atHash == claimsAtHash);
    }    
}
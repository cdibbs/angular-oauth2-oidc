import { Http, URLSearchParams, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import {Base64} from 'js-base64';
import {fromByteArray} from 'base64-js';
import sha256 from 'fast-sha256';
import * as nacl from 'tweetnacl-util';

import { IAuthStrategy } from './i';
import { BaseOAuthConfig, DiscoveryDocument } from './models';

@Injectable()
export class OAuthService {
    private _discoveryDoc: DiscoveryDocument;
    private discoveryDocumentLoadedSender: Observer<any>;
    public discoveryDocumentLoaded: boolean = false;
    public discoveryDocumentLoaded$: Observable<any>;

    public get strategy(): IAuthStrategy { return this._strategy; };
    public get config(): BaseOAuthConfig { return this._config; };
    public resource = "";
    public options: any;
    public state = "";
    public validationHandler: any;
    public dummyClientSecret: string;    
    private _storage: Storage = localStorage;

    public setStorage(storage: Storage) {
        this._storage = storage;
    }
    
    constructor(private http: Http, private _config: BaseOAuthConfig, private _strategy: IAuthStrategy) {}

    initiateLoginFlow(): Observable<any> { return this.strategy.initiateLoginFlow(); }

    refreshSession(): Promise<any> {
        return new Promise((resolve, reject) => { 
            let search = new URLSearchParams();
            search.set('grant_type', 'refresh_token');
            search.set('client_id', this.config.clientId);
            search.set('scope', this.config.scope);
            search.set('refresh_token', this._storage.getItem('refresh_token'));
            
            if (this.dummyClientSecret) {
                search.set('client_secret', this.dummyClientSecret);
            }

            let headers = new Headers();
            headers.set('Content-Type', 'application/x-www-form-urlencoded');

            let params = search.toString();

            this.http.post(this.tokenEndpoint, params, { headers }).map(r => r.json()).subscribe(
                (tokenResponse) => {
                    console.debug('refresh tokenResponse', tokenResponse);
                    this.storeAccessTokenResponse(tokenResponse.access_token, tokenResponse.refresh_token, tokenResponse.expires_in);
                    resolve(tokenResponse);
                },
                (err) => {
                    console.error('Error performing password flow', err);
                    reject(err);
                }
            );
        });

    }

    initImplicitFlow(additionalState = "") {
        location.href = this.createLoginUrl(additionalState);
    };
    
    callEventIfExists(options: any) {
                if (options.onTokenReceived) {
            var tokenParams = { 
                idClaims: this.getIdentityClaims(),
                idToken: this.getIdToken(),
                accessToken: this.getAccessToken(),
                state: this.state
            };
            options.onTokenReceived(tokenParams);
        }
    }

    tryLogin(options) {
        
        options = options || { };
        
        
        var parts = this.getFragment();

        var accessToken = parts["access_token"];
        var idToken = parts["id_token"];
        var state = parts["state"];
        
        var oidcSuccess = false;
        var oauthSuccess = false;

        if (!accessToken || !state) return false;
        if (this.config.oidc && !idToken) return false;

        var savedNonce = this._storage.getItem("nonce");

        var stateParts = state.split(';');
        var nonceInState = stateParts[0];
        if (savedNonce === nonceInState) {
            
            this.storeAccessTokenResponse(accessToken, null, parts['expires_in']);

            if (stateParts.length > 1) {
                this.state = stateParts[1];
            }

            oauthSuccess = true;

        }
        
        if (!oauthSuccess) return false;

        if (this.config.oidc) {
            oidcSuccess = this.processIdToken(idToken, accessToken);
            if (!oidcSuccess) return false;  
        }
        
        if (options.validationHandler) {
            
            var validationParams = {accessToken: accessToken, idToken: idToken};
            
            options
                .validationHandler(validationParams)
                .then(() => {
                    this.callEventIfExists(options);
                })
                .catch(function(reason) {
                    console.error('Error validating tokens');
                    console.error(reason);
                })
        }
        else {
            this.callEventIfExists(options);
        }
        
        if (this.config.clearHashAfterLogin) location.hash = '';        
        return true;
    };
    
    processIdToken(idToken, accessToken) {
            var tokenParts = idToken.split(".");
            var claimsBase64 = tokenParts[1] + "====".substr(0, tokenParts[1].length % 4);
            var claimsJson = Base64.decode(claimsBase64);
            var claims = JSON.parse(claimsJson);
            var savedNonce = this._storage.getItem("nonce");
            
            if (claims.aud !== this.config.clientId) {
                console.warn("Wrong audience: " + claims.aud);
                return false;
            }

            if (this.issuer && claims.iss !== this.issuer) {
                console.warn("Wrong issuer: " + claims.iss);
                return false;
            }

            if (claims.nonce !== savedNonce) {
                console.warn("Wrong nonce: " + claims.nonce);
                return false;
            }
            
            if (accessToken && !this.checkAtHash(accessToken, claims)) {
                console.warn("Wrong at_hash");
                return false;
            }
            
            // Das Prüfen des Zertifikates wird der Serverseite überlassen!

            var now = Date.now();
            var issuedAtMSec = claims.iat * 1000;
            var expiresAtMSec = claims.exp * 1000;
            
            var tenMinutesInMsec = 1000 * 60 * 10;

            if (issuedAtMSec - tenMinutesInMsec >= now  || expiresAtMSec + tenMinutesInMsec <= now) {
                console.warn("Token has been expired");
                console.warn({
                    now: now,
                    issuedAtMSec: issuedAtMSec,
                    expiresAtMSec: expiresAtMSec
                });
                return false;
            }

            this._storage.setItem("id_token", idToken);
            this._storage.setItem("id_token_claims_obj", claimsJson);
            this._storage.setItem("id_token_expires_at", "" + expiresAtMSec);
            
            if (this.validationHandler) {
                this.validationHandler(idToken)
            }
            
            return true;
    }
    
    getIdentityClaims() {
        var claims = this._storage.getItem("id_token_claims_obj");
        if (!claims) return null;
        return JSON.parse(claims);
    }
    
    getIdToken(): string { return this.strategy.getIdToken(); }
    getAccessToken(): string { return this.strategy.getAccessToken(); }
    hasValidAccessToken(): boolean { return this.strategy.hasValidAccessToken(); }
    hasValidIdToken(): boolean { return this.strategy.hasValidIdToken(); }

    /**
     * Calls the strategy's logout method.
     * @param {boolean} noRedirect whether to redirect after deleting the session information from storage. Default: false.
     */
    logOut(noRedirect: boolean = false): void { this.strategy.logout(noRedirect); };

    createAndSaveNonce(): string {
        var nonce = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 40; i++)
            nonce += possible.charAt(Math.floor(Math.random() * possible.length));    

        this._storage.setItem("nonce", nonce);
        return nonce;
    };

    getFragment() {
        if (window.location.hash.indexOf("#") === 0) {
            return this.parseQueryString(window.location.hash.substr(1));
        } else {
            return {};
        }
    };

    parseQueryString(queryString) {
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
}

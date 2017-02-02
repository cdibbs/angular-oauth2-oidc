import { Http, URLSearchParams, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import {Base64} from 'js-base64';
import {fromByteArray} from 'base64-js';
import sha256 from 'fast-sha256';
import * as nacl from 'tweetnacl-util';

import { IAuthStrategy, IOAuthService } from './i';
import { BaseOAuthConfig, DiscoveryDocument } from './models';

@Injectable()
export class OAuthService implements IOAuthService {
    private _discoveryDoc: DiscoveryDocument;
    private discoveryDocumentLoadedSender: Observer<any>;
    public discoveryDocumentLoaded: boolean = false;
    public discoveryDocumentLoaded$: Observable<any>;

    public get strategy(): IAuthStrategy { return this._strategy; };
    public get config(): BaseOAuthConfig { return this.strategy.config; };
    public resource = "";
    public options: any;
    public state = "";
    public validationHandler: any;
    public dummyClientSecret: string;    
    
    constructor(private http: Http, private _strategy: IAuthStrategy) {}

    public initiateLoginFlow(): Promise<any> { return this.strategy.initiateLoginFlow(); }

    public refreshSession(): Promise<any> { return this.strategy.refreshSession(); }
   
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
    
    getIdentityClaims(): any { return this.strategy.getIdentityClaims(); }    
    getIdToken(): string { return this.strategy.getIdToken(); }
    getAccessToken(): string { return this.strategy.getAccessToken(); }
    hasValidAccessToken(): boolean { return this.strategy.hasValidAccessToken(); }
    hasValidIdToken(): boolean { return this.strategy.hasValidIdToken(); }

    /**
     * Logs out of the session by deleting our token storage. Optionally skips
     * redirect, also. (warning: skipping the redirect means a user could still
     * restart the session without re-entering the password, depending on the
     * endpoint configuration).
     * @param {boolean} noRedirect Whether to skip the redirect. Defaults to false.
     */
    logOut(noRedirect: boolean = false): void { this.strategy.logOut(noRedirect); };
}

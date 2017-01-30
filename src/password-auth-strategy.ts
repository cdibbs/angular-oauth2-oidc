import { Http, URLSearchParams, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import { BaseAuthStrategy } from './base-auth-strategy';
import { DiscoveryDocument, OAuthConfig } from './models';

/**
 * Represents an OIDC authentication strategy.
 * The OpenID Connect (OIDC) strategy can provide JWT-encoded roles and basic profile
 * information, as configured. More information can be found, here:
 * https://en.wikipedia.org/wiki/OpenID_Connect
 */
export class PasswordAuthStrategy extends BaseAuthStrategy {
    public get loginUrl(): string { return this.fetchDocProp("authorization_endpoint", "fallbackLoginUri"); };
    public get logoutUrl(): string { return this.fetchDocProp("end_session_endpoint", "fallbackLogoutUri"); };
    public get tokenEndpoint(): string { return this.fetchDocProp("token_endpoint", "fallbackTokenEndpoint"); };
    public get userinfoEndpoint(): string { return this.fetchDocProp("userinfo_endpoint", "fallbackUserInfoEndpoint"); };
    public get issuer(): string { return this.fetchDocProp("issuer", "fallbackIssuer"); };

    public constructor(http: Http, _config: OAuthConfig) { super(http, _config); }

     loadUserProfile() {
        if (!this.hasValidAccessToken()) throw Error("Can not load User Profile without access_token");

        return new Promise((resolve, reject) => {
            let headers = new Headers();
            headers.set('Authorization', 'Bearer ' + this.getAccessToken());
            this.http.get(this.userinfoEndpoint, { headers }).map(r => r.json()).subscribe(
                (doc) => {
                    console.debug('userinfo received', doc);
                    this.config.storage.setItem('id_token_claims_obj', JSON.stringify(doc));
                    resolve(doc);
                },
                (err) => {
                    console.error('error loading user info', err);
                    reject(err);
                }
            );
        });
    }
}
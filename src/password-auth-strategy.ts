import { Http, URLSearchParams, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';

import { BaseAuthStrategy } from './base-auth-strategy';
import { DiscoveryDocument, BaseOAuthConfig, OAuthPasswordConfig, PasswordFlowOptions } from './models';

/**
 * Represents an OIDC authentication strategy.
 * The OpenID Connect (OIDC) strategy can provide JWT-encoded roles and basic profile
 * information, as configured. More information can be found, here:
 * https://en.wikipedia.org/wiki/OpenID_Connect
 */
export class PasswordAuthStrategy extends BaseAuthStrategy<OAuthPasswordConfig> {
    public get loginUrl(): string { return this.fetchDocProp("authorization_endpoint", "fallbackLoginUri"); };
    public get logoutUrl(): string { return this.fetchDocProp("end_session_endpoint", "fallbackLogoutUri"); };
    public get tokenEndpoint(): string { return this.fetchDocProp("token_endpoint", "fallbackTokenEndpoint"); };
    public get userinfoEndpoint(): string { return this.fetchDocProp("userinfo_endpoint", "fallbackUserInfoEndpoint"); };
    public get issuer(): string { return this.fetchDocProp("issuer", "fallbackIssuer"); };

    public constructor(http: Http, protected router: Router, _config: OAuthPasswordConfig) { super(http, router, _config); }

    public initiateLoginFlow(options: PasswordFlowOptions = null): Promise<any> {
        if (! options)
            throw new Error("Sorry, the password flow requires a username and password provided through the options parameter.");

        if (options.autoLoadUserProfile || this.config.autoLoadUserProfile)
            return this.fetchTokenUsingPasswordFlowAndLoadUserProfile(options.Username, options.Password)
        return this.fetchTokenUsingPasswordFlow(options.Username, options.Password);
    }

    private fetchTokenUsingPasswordFlowAndLoadUserProfile(userName: string, password: string): Promise<any> {
        return this
                .fetchTokenUsingPasswordFlow(userName, password)
                .then(() => this.loadUserProfile());
    }

    private fetchTokenUsingPasswordFlow(userName: string, password: string) {
        return new Promise((resolve, reject) => { 
            let search = new URLSearchParams();
            search.set('grant_type', 'password');
            search.set('client_id', this.config.clientId);
            search.set('scope', this.config.scope);
            search.set('username', userName);
            search.set('password', password);
            
            if (this.config.dummyClientSecret) {
                search.set('client_secret', this.config.dummyClientSecret);
            }

            let headers = new Headers();
            headers.set('Content-Type', 'application/x-www-form-urlencoded');

            let params = search.toString();
            this.http.post(this.tokenEndpoint, params, { headers }).map(r => r.json()).subscribe(
                (tokenResponse) => {
                    console.debug('tokenResponse', tokenResponse);
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

    private loadUserProfile(): Promise<any> {
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

    refreshSession(): Promise<any> {
        return new Promise((resolve, reject) => {
            let search = new URLSearchParams();
            search.set('grant_type', 'refresh_token');
            search.set('client_id', this.config.clientId);
            search.set('scope', this.config.scope);
            search.set('refresh_token', this.config.storage.getItem('refresh_token'));

            if (this.config.dummyClientSecret) {
                search.set('client_secret', this.config.dummyClientSecret);
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
}
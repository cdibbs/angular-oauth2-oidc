import { Http, URLSearchParams, Headers, RequestOptionsArgs } from '@angular/http';
import { DOCUMENT } from '@angular/platform-browser';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import * as moment from 'moment';

import { BaseAuthStrategy } from './base-auth-strategy';
import { DiscoveryDocument, BaseOAuthConfig, PasswordConfig, PasswordFlowOptions } from './models';
import { ILogService, LogServiceToken } from './i';

/**
 * Represents an OIDC authentication strategy.
 * The OpenID Connect (OIDC) strategy can provide JWT-encoded roles and basic profile
 * information, as configured. More information can be found, here:
 * https://en.wikipedia.org/wiki/OpenID_Connect
 */
@Injectable()
export class PasswordAuthStrategy extends BaseAuthStrategy<PasswordConfig> {
    public get kind(): string { return "password" };

    public get loginUrl(): string { return this.fetchDocProp("authorization_endpoint", "fallbackLoginUri"); };
    public get logoutUrl(): string { return this.fetchDocProp("end_session_endpoint", "fallbackLogoutUri"); };
    public get tokenEndpoint(): string { return this.fetchDocProp("token_endpoint", "fallbackTokenEndpoint"); };
    public get userinfoEndpoint(): string { return this.fetchDocProp("userinfo_endpoint", "fallbackUserInfoEndpoint"); };
    public get issuer(): string { return this.fetchDocProp("issuer", "fallbackIssuer"); };
    public get refreshes(): Observable<any> { return this.refreshLoaded$; };

    private refreshLoaded$: Observable<any>;
    private refreshLoadedSender: Observer<any>;

    public constructor(
        protected http: Http,
        protected router: Router,
        protected _config: BaseOAuthConfig,
        @Inject(DOCUMENT) protected document: any,
        @Inject(LogServiceToken) log: ILogService)
    {
        super(http, router, <PasswordConfig>_config, document, log);
        this.refreshLoaded$ = Observable.create((sender: Observer<any>) => {
            this.refreshLoadedSender = sender;
        }).publish().connect();
    }

    public initiateLoginFlow(options: PasswordFlowOptions = null): Promise<any> {
        if (! options)
            throw new Error("The password flow requires a username and password provided through the options parameter.");

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
                    this.tokenReceived(moment());
                    this.log.debug('tokenResponse', tokenResponse);
                    this.storeAccessTokenResponse(tokenResponse.access_token, tokenResponse.refresh_token, tokenResponse.expires_in);
                    resolve(tokenResponse);
                },
                (err) => {
                    this.log.error('Error performing password flow', err);
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
                    this.log.debug('userinfo received', doc);
                    this.config.storage.setItem('id_token_claims_obj', JSON.stringify(doc));
                    resolve(doc);
                },
                (err) => {
                    this.log.error('error loading user info', err);
                    reject(err);
                }
            );
        });
    }

    /**
     * Uses a post to the configured refresh-token endpoint to maintain the user session.
     * @param {number} timeout The timeout for the request in milliseconds. Default: 30000ms.
     */
    public refreshSession(timeout: number = 30000): Observable<any> {
            let search = new URLSearchParams();
            search.set('grant_type', 'refresh_token');
            search.set('client_id', this.config.clientId);
            search.set('scope', this.config.scope);
            search.set('refresh_token', this.config.storage.getItem('refresh_token'));
            if (this.config.dummyClientSecret)
                search.set('client_secret', this.config.dummyClientSecret);

            let headers = new Headers();
            headers.set('Content-Type', 'application/x-www-form-urlencoded');
            this.http.post(this.tokenEndpoint, search.toString(), <RequestOptionsArgs>{ headers: headers, search: search,  })
                .map(r => r.json())
                .subscribe(
                    (tokenResponse) => {
                        this.log.debug('refresh tokenResponse', tokenResponse);
                        this.storeAccessTokenResponse(tokenResponse.access_token, tokenResponse.refresh_token, tokenResponse.expires_in);
                        this.refreshLoadedSender.next(tokenResponse);
                    },
                    (err) => {
                        this.log.error('Error performing password flow', err);
                        this.refreshLoadedSender.error({ 'message': 'Error performing password flow refresh.', details: err });
                    }
            );
            return this.refreshLoaded$;
    }
}
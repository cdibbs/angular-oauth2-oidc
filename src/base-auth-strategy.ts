import { Http, URLSearchParams, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';

import { DiscoveryDocument, OAuthConfig } from './models';
import { IAuthStrategy } from './i';

@Injectable()
export class BaseAuthStrategy implements IAuthStrategy {
    protected _discoveryDoc: DiscoveryDocument;
    protected discoveryDocumentLoadedSender: Observer<any>;
    public discoveryDocumentLoaded: boolean = false;
    public discoveryDocumentLoaded$: Observable<any>;
    public now: Date = new Date();

    public constructor(protected http: Http, protected router: Router, protected _config: OAuthConfig) {
        this.discoveryDocumentLoaded$ = Observable.create(sender => {
            this.discoveryDocumentLoadedSender = sender;
        }).publish().connect();
    }

    public get config(): OAuthConfig { return this._config; };
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

    logOut(noRedirect: boolean = false): void {
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
}
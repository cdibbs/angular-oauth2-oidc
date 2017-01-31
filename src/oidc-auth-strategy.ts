import { Http, URLSearchParams, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';

import { BaseAuthStrategy } from './base-auth-strategy';
import { DiscoveryDocument, OAuthOIDCConfig, BaseOAuthConfig, OIDCFlowOptions } from './models';

/**
 * Represents an OIDC authentication strategy.
 * The OpenID Connect (OIDC) strategy can provide JWT-encoded roles and basic profile
 * information, as configured. More information can be found, here:
 * https://en.wikipedia.org/wiki/OpenID_Connect
 */
export class OIDCAuthStrategy extends BaseAuthStrategy<OAuthOIDCConfig> {
    public get loginUrl(): string { return this.fetchDocProp("authorization_endpoint", "fallbackLoginUri"); };
    public get logoutUrl(): string { return this.fetchDocProp("end_session_endpoint", "fallbackLogoutUri"); };
    public get tokenEndpoint(): string { return this.fetchDocProp("token_endpoint", "fallbackTokenEndpoint"); };
    public get userinfoEndpoint(): string { return this.fetchDocProp("userinfo_endpoint", "fallbackUserInfoEndpoint"); };
    public get issuer(): string { return this.fetchDocProp("issuer", "fallbackIssuer"); };

    public constructor(http: Http, protected router: Router, _config: OAuthOIDCConfig) { super(http, router, _config); }

    public initiateLoginFlow(options: OIDCFlowOptions = null): Promise<any> {
        location.href = this.createLoginUrl((options && options.additionalState) || null);

        return new Promise((resolve, reject) => reject("This return value is unused in the OIDC flow."));
    }
}
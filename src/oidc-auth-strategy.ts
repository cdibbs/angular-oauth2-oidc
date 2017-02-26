import { Http, URLSearchParams, Headers } from '@angular/http';
import { DOCUMENT } from '@angular/platform-browser';
import { Injectable, Inject } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';

import { BaseAuthStrategy } from './base-auth-strategy';
import { CheckSessionIFrame } from './check-session-iframe';
import { DiscoveryDocument, OIDCConfig, BaseOAuthConfig, OIDCFlowOptions } from './models';

/**
 * Represents an OIDC authentication strategy.
 * The OpenID Connect (OIDC) strategy can provide JWT-encoded roles and basic profile
 * information, as configured. More information can be found, here:
 * https://en.wikipedia.org/wiki/OpenID_Connect
 */
@Injectable()
export class OIDCAuthStrategy extends BaseAuthStrategy<OIDCConfig> {
    public get kind(): string { return "oidc" };

    public constructor(
        protected http: Http,
        protected router: Router,
        @Inject(DOCUMENT) protected document: any,
        protected iframe: CheckSessionIFrame,
        _config: BaseOAuthConfig)
    {
        super(http, router, _config, document);
    }

    public get checkSessionIFrameUri(): string { return this.fetchDocProp("check_session_iframe", "FallbackCheckSessionIFrame"); }

    public initiateLoginFlow(options: OIDCFlowOptions = null): Promise<any> {
        var url = this.createLoginUrl((options && options.additionalState) || null);
        this.document.location.href = url;

        return new Promise((resolve, reject) => resolve("This return value is unused in the OIDC flow."));
    }

    public createLoginUrl(extraState: string = undefined): string {
        let nonce = this.createAndSaveNonce();
        let url = super.createLoginUrl(extraState, nonce);
        url += "&nonce=" + encodeURIComponent(nonce);
        return url;
    }

    public refreshSession(timeout: number = 30000): Observable<any> {
        return this.iframe.navigate(this.checkSessionIFrameUri, timeout);
    }
}
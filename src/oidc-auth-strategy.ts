import { Http, URLSearchParams, Headers } from '@angular/http';
import { DOCUMENT } from '@angular/platform-browser';
import { Injectable, Inject } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';

import { BaseAuthStrategy } from './base-auth-strategy';
import { CheckSessionIFrame } from './check-session-iframe';
import { DiscoveryDocument, OIDCConfig, BaseOAuthConfig, OIDCFlowOptions } from './models';
import { IJWT } from './models/i';
import { ILogService, LogServiceToken } from './i';

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
        _config: BaseOAuthConfig,
        @Inject(LogServiceToken) log: ILogService)
    {
        super(http, router, <OIDCConfig>_config, document, log);
    }

    public get checkSessionIFrameUri(): string { return this.createLoginUrl("refresh"); }

    public completeLoginFlow(): Promise<IJWT> {
        return super.completeLoginFlow()
            .then<IJWT>((jwt: IJWT) => {
                var state = this.config.storage.getItem("state");
                if (state == "refresh" && window.parent && typeof window.parent["oidcRefreshComplete"] == "function") { // Then this was a refresh within an iframe
                    this.config.storage.removeItem("state");
                    window.parent["oidcRefreshComplete"]();
                    document["completeRefresh"](jwt);
                }
                return jwt;
            });
    }

    public initiateLoginFlow(options: OIDCFlowOptions = null): Promise<boolean> {
        let gotoLogin = () => {
            var url = this.createLoginUrl((options && options.additionalState) || null);
            this.document.location.href = url;
            return true;
        };
        if (! this.discoveryDocumentLoaded && this.config.useDiscovery) {
            this.loadDiscoveryDocument().then(d => gotoLogin());
        } else {
            return new Promise((resolve, reject) => {
                if (gotoLogin()) resolve(true);
                else reject("Login URL creation failed.");
            });
        }
    }

    public createLoginUrl(extraState: string = undefined): string {
        let nonce = this.createAndSaveNonce();
        let url = super.createLoginUrl(extraState, nonce);
        url += "&nonce=" + encodeURIComponent(nonce);
        return url;
    }

    public refreshSession(timeout: number = 30000): Observable<any> {
        if (this.checkSessionIFrameUri)
            return this.iframe.navigate(this.checkSessionIFrameUri, timeout);
    }
}
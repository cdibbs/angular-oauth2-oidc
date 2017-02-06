import { Http } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { IAuthStrategy, IOAuthService } from './i';
import { BaseAuthStrategy } from './base-auth-strategy';
import { BaseOAuthConfig } from './models';

@Injectable()
export class OAuthService<T extends BaseOAuthConfig> implements IOAuthService {
    public get strategy(): IAuthStrategy<T> { return this._strategy; };
    public get config(): BaseOAuthConfig { return this.strategy.config; };
    public resource = '';
    public options: any;
    public state = '';
    public validationHandler: any;
    public dummyClientSecret: string;

    constructor(
        private http: Http,
        private _strategy: BaseAuthStrategy<T>) {}

    public initiateLoginFlow(): Promise<any> { return this.strategy.initiateLoginFlow(); }

    public refreshSession(): Observable<any> { return this.strategy.refreshSession(); }

    get identityClaims(): any { return this.strategy.identityClaims; }
    get idToken(): string { return this.strategy.getIdToken(); }
    get accessToken(): string { return this.strategy.getAccessToken(); }
    get hasValidAccessToken(): boolean { return this.strategy.hasValidAccessToken(); }
    get hasValidIdToken(): boolean { return this.strategy.hasValidIdToken(); }

    /**
     * Logs out of the session by deleting our token storage. Optionally skips
     * redirect, also. (warning: skipping the redirect means a user could still
     * restart the session without re-entering the password, depending on the
     * endpoint configuration).
     * @param {boolean} noRedirect Whether to skip the redirect. Defaults to false.
     */
    logOut(noRedirect = false): void { this.strategy.logOut(noRedirect); };
}

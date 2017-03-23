import { Http } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { SelectedAuthStrategyToken } from './base-auth-strategy';
import { AnyAuthStrategy, IOAuthService, IAuthStrategy, ILogService, LogServiceToken } from './i';
import { BaseOAuthConfig, DiscoveryDocument } from './models';

@Injectable()
export class OAuthService<T extends BaseOAuthConfig> implements IOAuthService {
    public get strategy(): IAuthStrategy { return this._strategy; };
    public get config(): BaseOAuthConfig { return this._config; };
    public options: any;
    public state = '';
    public validationHandler: any;
    public dummyClientSecret: string;
    public lastBumped: moment.Moment;
    private tokenReceived: moment.Moment = null;
    private _sessionEvents: Observable<any> = null;
    public get SessionEvents(): Observable<any> { return this._sessionEvents; }

    constructor(
        private http: Http,
        private _config: BaseOAuthConfig,
        @Inject(SelectedAuthStrategyToken) private _strategy: IAuthStrategy,
        @Inject(LogServiceToken) log: ILogService)
    {
            this._sessionEvents = Observable
                .interval(30000)
                .flatMap<any, any>(() => {
                    var exp = moment(this.strategy.getTokenExpiration(this.idToken));
                    var ttexp = moment.duration(exp.diff(moment()));
                    var tslastRefreshed = moment.duration(moment().diff(this.strategy.tokenReceived()));
                    var tslastBumped = moment.duration(moment().diff(this.lastBumped));
                    //let durExp = "" + Math.floor(ttexp.asHours()) + moment.utc(ttexp.asMilliseconds()).format(":mm:ss");
                    if (tslastBumped.asMinutes() < this.config.userActivityWindow
                        && tslastRefreshed.asMinutes() > this.config.sessionRefreshInterval) {
                            this.refreshSession();
                    }
                    return Observable.from([{
                        tokenExpires: exp,
                        timeTilTokenExpires: ttexp,
                        timeSinceLastRefresh: tslastRefreshed,
                        timeSinceLastBumped: tslastBumped
                    }]);
                });
            this.lastBumped = moment();
        }

    /** Notify of a user interaction (for the sake of preserving a session). */
    public bump(): void { this.lastBumped = moment(); }
    public initiateLoginFlow(): Promise<any> { return this.strategy.initiateLoginFlow(); }
    public completeLoginFlow(): Promise<any> { return this.strategy.completeLoginFlow(); }
    public loadDiscoveryDocument(fullUrl?: string): Promise<DiscoveryDocument> { return this.strategy.loadDiscoveryDocument(fullUrl); }

    public refreshSession(timeout?: number): Observable<any> { return this.strategy.refreshSession(timeout); }
    private get _window(): Window { return window; }
    get identityClaims(): any { return this.strategy.identityClaims; }
    get idToken(): any { return this.strategy.decodeToken(this.idTokenRaw); }
    get idTokenRaw(): string { return this.strategy.getIdToken(); }
    get accessToken(): any { return this.strategy.decodeToken(this.accessTokenRaw); }
    get accessTokenRaw(): string { return this.strategy.getAccessToken(); }
    get isSessionExpired(): boolean {
        return this.strategy.isTokenExpired(this.idToken);
    }
    get sessionExpiration(): Date {
        return this.strategy.getTokenExpiration(this.idToken);
    }

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

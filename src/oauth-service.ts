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

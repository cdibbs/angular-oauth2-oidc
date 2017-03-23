import { OpaqueToken } from '@angular/core';

import { ILogService } from '../i/i-log.service';
import { IOAuthConfig } from './i/i-oauth-config';

/** Represents the basic configuration required for OAuthService. */
export class BaseOAuthConfig implements IOAuthConfig {
    /** Internal. */
    public kind: string = "base";

    /** Which Storage mechanism to use. E.g., sessionStorage or localStorage (default). */
    public storage: Storage = localStorage;

    /** Required. The URI to which the auth endpoint should redirect after login. */
    public redirectUri: string = null;
    
    /** Required. The client id of the application to login. Must be preconfigured at the auth endpoint. */
    public clientId: string = null;

    /** Whether to use OIDC. Default: false. */
    public oidc: boolean = false;

    /** Required. The scope of the login. Normally a space-separated list, e.g., "openid profile email." */
    public scope: string = null;

    /** Whether to clear everything after the # after login. Defaults to true.*/
    public clearHashAfterLogin: boolean = true;

    public resource: string = null;

    /** Consider the user active if bump() events recorded within the past specified number of minutes. */
    public userActivityWindow: number = 15;

    /** How often, in minutes, to refresh the session if the user is active. */
    public sessionRefreshInterval: number = 15;

    /** Set this to false to skip loading the discovery document and only use fallback properties. */
    public useDiscovery: boolean = true;

    /** Optional, but recommended. The base URI of your auth endpoint, if the discovery document could not be loaded. */
    public fallbackIssuer: string = null;

    /** Optional, but recommended. The URI to use for logins, if the discovery document could not be loaded. */
    public fallbackLoginUri: string = null;

    /** Optional, but recommended. The URI to use for logouts, if the discovery document could not be loaded. */
    public fallbackLogoutUri: string = null;

    /** Optional */
    public fallbackTokenEndpoint: string = null;

    /** A logger factory returning a logger that matches the method signature of console. Default: console. */
    logFactory: (...args: any[]) => ILogService = () => console;
}

export let UserProvidedConfig = new OpaqueToken("UserProvidedConfig");
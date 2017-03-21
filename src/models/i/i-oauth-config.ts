import { ILogService } from '../../i/i-log.service';

/** Represents the basic configuration required for OAuthService. */
export interface IOAuthConfig {
    /** Configuration type. */
    kind: string;

    /** Which Storage mechanism to use. E.g., sessionStorage or localStorage (default). */
    storage?: Storage;

    /** Required. The URI to which the auth endpoint should redirect after login. */
    redirectUri: string;

    /** Required. The client id of the application to login. Must be preconfigured at the auth endpoint. */
    clientId: string;

    /** Whether to use OIDC. Default: false. */
    oidc?: boolean;

    /** Required. The scope of the login. Normally a space-separated list, e.g., "openid profile email." */
    scope: string;

    /** Whether to clear everything after the # after login. Defaults to true.*/
    clearHashAfterLogin?: boolean;

    resource?: string;

    /** Set this to false to skip loading the discovery document and only use fallback properties. */
    useDiscovery?: boolean;

    /**
     * Optional, but recommended. The URI of the auth endpoint discovery document. You must provide
     * either this, or the fallback* config options.
     */
    discoveryDocumentUri?: string;

    /** Optional, but recommended. The base URI of your auth endpoint, if the discovery document could not be loaded. */
    fallbackIssuer?: string;

    /** Optional, but recommended. The URI to use for logins, if the discovery document could not be loaded. */
    fallbackLoginUri?: string;

    /** Optional, but recommended. The URI to use for logouts, if the discovery document could not be loaded. */
    fallbackLogoutUri?: string;

    /** Optional */
    fallbackTokenEndpoint?: string;

    /** A logger matching the method signatures of console. Default: console. */
    log?: ILogService;
}
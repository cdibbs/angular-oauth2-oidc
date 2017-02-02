/** Represents the basic configuration required for OAuthService. */
export class BaseOAuthConfig {
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

    /**
     * Optional, but recommended. The URI of the auth endpoint discovery document. You must provide
     * either this, or the fallback* config options.
     */
    public discoveryDocumentUri: string = null;

    /** Optional, but recommended. The base URI of your auth endpoint, if the discovery document could not be loaded. */
    public fallbackIssuer: string = null;

    /** Optional, but recommended. The URI to use for logins, if the discovery document could not be loaded. */
    public fallbackLoginUri: string = null;

    /** Optional, but recommended. The URI to use for logouts, if the discovery document could not be loaded. */
    public fallbackLogoutUri: string = null;

    /** Optional */
    public fallbackTokenEndpoint: string = null;
}
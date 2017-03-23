import { OpaqueToken } from '@angular/core';
/**
 * Represents the basic configuration required for OAuthService.
 */
var BaseOAuthConfig = (function () {
    function BaseOAuthConfig() {
        this.kind = "base";
        this.storage = localStorage;
        this.redirectUri = null;
        this.clientId = null;
        this.oidc = false;
        this.scope = null;
        this.clearHashAfterLogin = true;
        this.resource = null;
        this.userActivityWindow = 15;
        this.sessionRefreshInterval = 15;
        this.useDiscovery = true;
        this.fallbackIssuer = null;
        this.fallbackLoginUri = null;
        this.fallbackLogoutUri = null;
        this.fallbackTokenEndpoint = null;
    }
    return BaseOAuthConfig;
}());
export { BaseOAuthConfig };
function BaseOAuthConfig_tsickle_Closure_declarations() {
    /**
     * Internal.
     * @type {?}
     */
    BaseOAuthConfig.prototype.kind;
    /**
     * Which Storage mechanism to use. E.g., sessionStorage or localStorage (default).
     * @type {?}
     */
    BaseOAuthConfig.prototype.storage;
    /**
     * Required. The URI to which the auth endpoint should redirect after login.
     * @type {?}
     */
    BaseOAuthConfig.prototype.redirectUri;
    /**
     * Required. The client id of the application to login. Must be preconfigured at the auth endpoint.
     * @type {?}
     */
    BaseOAuthConfig.prototype.clientId;
    /**
     * Whether to use OIDC. Default: false.
     * @type {?}
     */
    BaseOAuthConfig.prototype.oidc;
    /**
     * Required. The scope of the login. Normally a space-separated list, e.g., "openid profile email."
     * @type {?}
     */
    BaseOAuthConfig.prototype.scope;
    /**
     * Whether to clear everything after the # after login. Defaults to true.
     * @type {?}
     */
    BaseOAuthConfig.prototype.clearHashAfterLogin;
    /** @type {?} */
    BaseOAuthConfig.prototype.resource;
    /**
     * Consider the user active if bump() events recorded within the past specified number of minutes.
     * @type {?}
     */
    BaseOAuthConfig.prototype.userActivityWindow;
    /**
     * How often, in minutes, to refresh the session if the user is active.
     * @type {?}
     */
    BaseOAuthConfig.prototype.sessionRefreshInterval;
    /**
     * Set this to false to skip loading the discovery document and only use fallback properties.
     * @type {?}
     */
    BaseOAuthConfig.prototype.useDiscovery;
    /**
     * Optional, but recommended. The base URI of your auth endpoint, if the discovery document could not be loaded.
     * @type {?}
     */
    BaseOAuthConfig.prototype.fallbackIssuer;
    /**
     * Optional, but recommended. The URI to use for logins, if the discovery document could not be loaded.
     * @type {?}
     */
    BaseOAuthConfig.prototype.fallbackLoginUri;
    /**
     * Optional, but recommended. The URI to use for logouts, if the discovery document could not be loaded.
     * @type {?}
     */
    BaseOAuthConfig.prototype.fallbackLogoutUri;
    /**
     * Optional
     * @type {?}
     */
    BaseOAuthConfig.prototype.fallbackTokenEndpoint;
    /**
     * A logger factory returning a logger that matches the method signature of console. Default: console.
     * @type {?}
     */
    BaseOAuthConfig.prototype.logFactory;
}
export var /** @type {?} */ UserProvidedConfig = new OpaqueToken("UserProvidedConfig");
//# sourceMappingURL=D:/temp/angular-oauth2-oidc/src/models/base-oauth-config.js.map
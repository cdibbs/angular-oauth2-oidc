import { OpaqueToken } from '@angular/core';
/**
 * Represents the basic configuration required for OAuthService.
 */
var BaseOAuthConfig = (function () {
    function BaseOAuthConfig() {
        /**
         * Internal.
         */
        this.kind = "base";
        /**
         * Which Storage mechanism to use. E.g., sessionStorage or localStorage (default).
         */
        this.storage = localStorage;
        /**
         * Required. The URI to which the auth endpoint should redirect after login.
         */
        this.redirectUri = null;
        /**
         * Required. The client id of the application to login. Must be preconfigured at the auth endpoint.
         */
        this.clientId = null;
        /**
         * Whether to use OIDC. Default: false.
         */
        this.oidc = false;
        /**
         * Required. The scope of the login. Normally a space-separated list, e.g., "openid profile email."
         */
        this.scope = null;
        /**
         * Whether to clear everything after the # after login. Defaults to true.
         */
        this.clearHashAfterLogin = true;
        this.resource = null;
        /**
         * Consider the user active if bump() events recorded within the past specified number of minutes.
         */
        this.userActivityWindow = 15;
        /**
         * How often, in minutes, to refresh the session if the user is active.
         */
        this.sessionRefreshInterval = 15;
        /**
         * Set this to false to skip loading the discovery document and only use fallback properties.
         */
        this.useDiscovery = true;
        /**
         * Optional, but recommended. The base URI of your auth endpoint, if the discovery document could not be loaded.
         */
        this.fallbackIssuer = null;
        /**
         * Optional, but recommended. The URI to use for logins, if the discovery document could not be loaded.
         */
        this.fallbackLoginUri = null;
        /**
         * Optional, but recommended. The URI to use for logouts, if the discovery document could not be loaded.
         */
        this.fallbackLogoutUri = null;
        /**
         * Optional
         */
        this.fallbackTokenEndpoint = null;
        /**
         * A logger factory returning a logger that matches the method signature of console. Default: console.
         */
        this.logFactory = function () { return console; };
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
//# sourceMappingURL=C:/cygwin64/home/cdibbs/git/angular-oauth2-oidc/lib/models/base-oauth-config.js.map
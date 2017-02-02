import { BaseOAuthConfig } from '../models';

export interface IAuthStrategy {
    config: BaseOAuthConfig;
    loginUrl: string;
    logoutUrl: string;

    loadDiscoveryDocument(fullUrl: string): Promise<any>;
    getIdToken(): string;
    getAccessToken(): string;
    getIdentityClaims(): any;
    hasValidAccessToken(): boolean;
    hasValidIdToken(): boolean;

    /**
     * Logs out of the session by deleting our token storage. Optionally skips
     * redirect, also. (warning: skipping the redirect means a user could still
     * restart the session without re-entering the password, depending on the
     * endpoint configuration).
     * @param {boolean} noRedirect Whether to skip the redirect. Defaults to false.
     */
    logOut(noRedirect: boolean): void;

    /**
     * Initiates the login process for this strategy. If the strategy
     * returns a Promise for a user profile, so will this method. Otherwise, it returns
     * a rejected promise that should be ignored.
     * @param {BaseFlowOptions} options Additional state and options for the given strategy.
     * @returns A promise for a user profile.
     */
    initiateLoginFlow(): Promise<any>;

    /**
     * Refreshes the existing session by asynchronously communicating with the configured endpoint.
     * Does not require user intervention.
     * @returns {Promise<any>} A promise for a token response from the endpoint.
     */
    refreshSession(): Promise<any>;
}
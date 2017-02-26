import { BaseOAuthConfig } from '../models/base-oauth-config';
import { DiscoveryDocument } from '../models/discovery-document';
import { Observable } from 'rxjs';
import { BaseFlowOptions } from '../models';

import { IJWT } from '../models/i';

export interface IAuthStrategy {
    kind: string;
    loginUrl: string;
    logoutUrl: string;
    identityClaims: any;

    loadDiscoveryDocument(fullUrl: string): Promise<DiscoveryDocument>;
    getIdToken(): string;
    getAccessToken(): string;
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
     * returns a Promise for a user profile, so will this method. Otherwise, with the
     * OIDC flow, either a redirect will occur, or a rejected promise will be returned.
     * @param {BaseFlowOptions} options Additional state and options for the given strategy.
     * @returns A promise for a user profile.
     */
    initiateLoginFlow<T extends BaseOAuthConfig>(options?: BaseFlowOptions<T>): Promise<any>;

    /**
     * If the auth strategy required a redirect (e.g., OIDC), calling this upon
     * return will complete the login process and return a decoded JSON Web Token.
     * @returns A promise for a decoded JSON Web Token.
     */
    completeLoginFlow(): Promise<IJWT>;

    /**
     * Refreshes the existing session by asynchronously communicating with the configured endpoint.
     * Does not require user intervention.
     * @returns {Promise<any>} A promise for a token response from the endpoint.
     */
    refreshSession(timeout?: number): Observable<any>;
}
import { OAuthConfig } from '../models';

export interface IAuthStrategy {
    config: OAuthConfig;
    loginUrl: string;
    logoutUrl: string;

    loadDiscoveryDocument(fullUrl: string): Promise<any>;
    getIdToken(): string;
    getAccessToken(): string;
    hasValidAccessToken(): boolean;
    hasValidIdToken(): boolean;

    logOut(noRedirect: boolean): void;
}
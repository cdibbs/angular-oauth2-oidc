import { BaseOAuthConfig } from './base-oauth-config';

export class PasswordConfig extends BaseOAuthConfig {
    /** Whether to immediately load the profile from the user endpoint following successful login. */
    public autoLoadUserProfile: boolean = true;

    /** This is unnecessary, but provided, anyway. */
    public dummyClientSecret: string;

    /** If discovery fails, use this endpoint for retrieving user info. */
    public fallbackUserInfoEndpoint: string = null;
}
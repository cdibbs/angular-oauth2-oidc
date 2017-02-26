import { BaseOAuthConfig } from './base-oauth-config';
import { IPasswordConfig } from './i/i-password-config';

export class PasswordConfig extends BaseOAuthConfig implements IPasswordConfig {
    public kind: string = "password";
    /** Whether to immediately load the profile from the user endpoint following successful login. */
    public autoLoadUserProfile: boolean = true;

    /** This is unnecessary, but provided, anyway. */
    public dummyClientSecret: string;

    /** If discovery fails, use this endpoint for retrieving user info. */
    public fallbackUserInfoEndpoint: string = null;
}
import { IOAuthConfig } from './i-oauth-config';

export interface IPasswordConfig extends IOAuthConfig {
    /** Whether to immediately load the profile from the user endpoint following successful login. */
     autoLoadUserProfile: boolean;

    /** This is unnecessary, but provided, anyway. */
     dummyClientSecret: string;

    /** If discovery fails, use this endpoint for retrieving user info. */
     fallbackUserInfoEndpoint: string;
}
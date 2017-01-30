import { IAuthStrategy } from './i-auth-strategy';
import { OAuthConfig } from '../models/oauth-config';

export interface IOIDCAuthStrategy extends IAuthStrategy {
    tokenEndpoint: string;
    userinfoEndpoint: string;
    issuer: string;
}
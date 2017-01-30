import { IAuthStrategy } from './i-auth-strategy';
import { OAuthConfig } from '../models/oauth-config';

export interface IBasicAuthStrategy extends IAuthStrategy {
    tokenEndpoint: string;
    userinfoEndpoint: string;
    issuer: string;
}
import { IAuthStrategy } from './i-auth-strategy';
import { OAuthOIDCConfig } from '../models';

export interface IOIDCAuthStrategy extends IAuthStrategy<OAuthOIDCConfig> {
    tokenEndpoint: string;
    userinfoEndpoint: string;
    issuer: string;
}
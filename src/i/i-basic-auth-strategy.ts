import { IAuthStrategy } from './i-auth-strategy';
import { OAuthPasswordConfig } from '../models';

export interface IBasicAuthStrategy extends IAuthStrategy<OAuthPasswordConfig> {
    tokenEndpoint: string;
    userinfoEndpoint: string;
    issuer: string;
}
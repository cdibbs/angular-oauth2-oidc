import { IAuthStrategy } from './i-auth-strategy';
import { OIDCConfig } from '../models';

export interface IOIDCAuthStrategy extends IAuthStrategy {
    config: OIDCConfig;
    tokenEndpoint: string;
    userinfoEndpoint: string;
    issuer: string;
}
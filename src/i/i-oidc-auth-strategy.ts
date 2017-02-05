import { IAuthStrategy } from './i-auth-strategy';

export interface IOIDCAuthStrategy extends IAuthStrategy {
    tokenEndpoint: string;
    userinfoEndpoint: string;
    issuer: string;
}
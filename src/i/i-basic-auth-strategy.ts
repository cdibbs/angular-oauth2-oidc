import { IAuthStrategy } from './i-auth-strategy';

export interface IBasicAuthStrategy extends IAuthStrategy {
    tokenEndpoint: string;
    userinfoEndpoint: string;
    issuer: string;
}
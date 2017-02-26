import { IAuthStrategy } from './i-auth-strategy';
import { PasswordConfig } from '../models';

export interface IBasicAuthStrategy extends IAuthStrategy {
    config: PasswordConfig;
    tokenEndpoint: string;
    userinfoEndpoint: string;
    issuer: string;
}
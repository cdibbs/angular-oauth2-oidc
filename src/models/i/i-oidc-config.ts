import { IOAuthConfig } from './i-oauth-config';

export interface IOIDCConfig extends IOAuthConfig {
    sessionRefreshInterval: number;
    userActivityWindow: number;
}
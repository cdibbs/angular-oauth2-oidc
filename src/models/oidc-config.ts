import { BaseOAuthConfig } from './base-oauth-config';
import { IOIDCConfig } from './i/i-oidc-config';

export class OIDCConfig extends BaseOAuthConfig implements IOIDCConfig {
    public kind: string = "oidc";
}
import { URLSearchParams } from '@angular/http';
import { BaseOAuthConfig } from './base-oauth-config';

export class BaseFlowOptions<TConfig extends BaseOAuthConfig> {
    public additionalState: string = null;
}
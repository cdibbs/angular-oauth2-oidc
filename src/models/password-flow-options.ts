import { BaseFlowOptions } from './base-flow-options';
import { OAuthPasswordConfig } from './oauth-password-config';

export class PasswordFlowOptions extends BaseFlowOptions<OAuthPasswordConfig> {
    public Username: string;
    public Password: string;
    public autoLoadUserProfile: boolean = false;
}
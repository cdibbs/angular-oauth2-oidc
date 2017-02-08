import { BaseFlowOptions } from './base-flow-options';
import { PasswordConfig } from './password-config';

export class PasswordFlowOptions extends BaseFlowOptions<PasswordConfig> {
    public Username: string;
    public Password: string;
    public autoLoadUserProfile: boolean = false;
}
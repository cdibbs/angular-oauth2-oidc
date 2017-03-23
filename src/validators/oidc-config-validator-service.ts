import { BaseConfigValidator } from './base-config-validator-service';
import { OIDCConfig, BaseOAuthConfig, ConfigValidationResult } from '../models';

export class OIDCConfigValidatorService extends BaseConfigValidator<OIDCConfig> {
    public validate(config: OIDCConfig): ConfigValidationResult[] {
        let results = super.validate(config);
        if (!config) return results;

        if (config.useIFrameRefresh) {
            if (! this.nonEmptyString(config.iFrameRefreshUri)) {
                results.push(new ConfigValidationResult("When useIFrameRefresh == true, you must provide a refresh URI.", "iFrameRefreshUri"));
            }

            if (config.sessionRefreshInterval < 0.5) {
                results.push(new ConfigValidationResult("Cannot be less than 0.5 minutes (30 seconds).", "sessionRefreshInterval"));
            }

            if (config.userActivityWindow <= 0.5) {
                results.push(new ConfigValidationResult("Must be greater than 0.5 minutes (30 seconds).", "userActivityWindow"));
            }
        }

        return results;
    }
}
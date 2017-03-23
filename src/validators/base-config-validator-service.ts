import { BaseOAuthConfig, ConfigValidationResult } from '../models';
import { IConfigValidator } from './i/i-config-validator-service';

export class BaseConfigValidator<TConfig extends BaseOAuthConfig> implements IConfigValidator {
    public validate(config: TConfig): ConfigValidationResult[] {
        let results: ConfigValidationResult[];

        if (! config)
            return [ new ConfigValidationResult("Supplied configuration cannot be null.") ];

        results = [];
        if (! this.nonEmptyString(config.redirectUri)) {
            results.push(new ConfigValidationResult("Must supply a valid URI.", "redirectUri"));
        }

        if (! config.useDiscovery) {
            let useDisc_Uri = "Must supply a valid URI when useDiscovery == false.";
            if (! this.nonEmptyString(config.fallbackLoginUri)) {
                results.push(new ConfigValidationResult(useDisc_Uri, "fallbackLoginUri"));
            }

            if (! this.nonEmptyString(config.fallbackLogoutUri)) {
                results.push(new ConfigValidationResult(useDisc_Uri, "fallbackLogoutUri"));
            }

            if (! this.nonEmptyString(config.fallbackTokenEndpoint)) {
                results.push(new ConfigValidationResult(useDisc_Uri, "fallbackTokenEndpoint"));
            }
        }

        if (! config.storage) {
            results.push(new ConfigValidationResult("Must provide valid storage backend, or omit to use default.", "storage"));
        }

        if (typeof config.logFactory != "function") {
            results.push(new ConfigValidationResult("Must provide valid logFactory, or omit to use default.", "logFactory"));
        }

        if (! this.nonEmptyString(config.clientId)) {
            results.push(new ConfigValidationResult("Must provide a non-empty clientId.", "clientId"));
        }

        return results;
    }

    protected nonEmptyString(e: any): boolean {
        return e && typeof e === "string";
    }
}
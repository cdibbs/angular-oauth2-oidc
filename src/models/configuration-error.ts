import { ConfigValidationResult } from './config-validation-result';

export class ConfigurationError extends Error {
    constructor(public message: string, public errors: ConfigValidationResult[])
    {
        super(JSON.stringify(errors));
    }
}
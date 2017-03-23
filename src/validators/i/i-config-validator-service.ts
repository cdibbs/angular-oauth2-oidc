import { OpaqueToken } from '@angular/core';

import { IOAuthConfig } from '../../models/i';
import { ConfigValidationResult } from '../../models';

export interface IConfigValidator {
    validate(config: IOAuthConfig): ConfigValidationResult[];
}

export let ConfigValidatorToken = new OpaqueToken("ConfigValidator");

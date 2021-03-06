import { OpaqueToken } from '@angular/core';
import { IOIDCAuthStrategy } from './i-oidc-auth-strategy';
import { IBasicAuthStrategy } from './i-basic-auth-strategy';

export * from './i-auth-strategy';
export * from './i-oidc-auth-strategy';
export * from './i-basic-auth-strategy';
export * from './i-oauth-service';
export * from './i-log.service';

export let LogServiceToken = new OpaqueToken("ILogService");
export type AnyAuthStrategy = IOIDCAuthStrategy | IBasicAuthStrategy;
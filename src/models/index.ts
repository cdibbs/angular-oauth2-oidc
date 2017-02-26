import { OpaqueToken } from '@angular/core';

export * from './base-oauth-model';
export * from './base-oauth-config';
export * from './password-config';
export * from './oidc-config';
export * from './discovery-document';

export * from './base-flow-options';
export * from './password-flow-options';
export * from './oidc-flow-options';
export * from './token-validation-result';

export let ConfigToken = new OpaqueToken("ConfigToken");
import { Inject, Injectable } from '@angular/core';
import { ConfigToken, BaseOAuthConfig } from '../models';
import { IAuthStrategy } from '../i';
import { AuthStrategyToken } from '../base-auth-strategy';

export function authStrategyFactory(strategies: IAuthStrategy[], config: BaseOAuthConfig): IAuthStrategy {
  return strategies.filter(s => s.kind == config.kind)[0];
}
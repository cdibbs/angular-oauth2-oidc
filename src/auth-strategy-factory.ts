import { Inject, Injectable } from '@angular/core';
import { ConfigToken, BaseOAuthConfig } from './models';
import { IAuthStrategy } from './i';
import { AuthStrategyToken } from './base-auth-strategy';

@Injectable()
export class AuthStrategyFactory {
  constructor(@Inject(AuthStrategyToken) private strategies: IAuthStrategy[]) {
  }

  public get(config: BaseOAuthConfig): IAuthStrategy {
    return this.strategies.filter(s => s.kind == config.kind)[0];
  }
  //console.log(strategies);
    /*switch(config.kind.toLowerCase()) {
      case "oidc":
        return OIDCAuthStrategy;
        break;
      case "password":
        return PasswordAuthStrategy;
        break;
      default:
        throw new Error(`Auth config ${config.kind} not recognized.`);
    }*/
}
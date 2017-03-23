import { NgModule, ModuleWithProviders, ClassProvider, ValueProvider, FactoryProvider } 
  from "@angular/core";
import { CommonModule } from "@angular/common";

import { OAuthService } from './oauth-service';
import { BaseAuthStrategy, AuthStrategyToken, SelectedAuthStrategyToken } from './base-auth-strategy';
import { OIDCAuthStrategy } from './oidc-auth-strategy';
import { PasswordAuthStrategy } from './password-auth-strategy';
import { IOAuthConfig } from './models/i';
import { OIDCConfig, PasswordConfig, ConfigToken, BaseOAuthConfig, UserProvidedConfig } from './models';
import { ConfigValidatorToken } from './validators/i';
import { OIDCConfigValidatorService } from './validators';
import { CheckSessionIFrame } from './check-session-iframe';
import { LogServiceToken } from './i';

import { authStrategyFactory, configFactory } from './injection';

@NgModule({
  imports: [
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class OAuthModule {
  static forRoot(config: IOAuthConfig): ModuleWithProviders {
    return {
      ngModule: OAuthModule,
      providers: [
        <ClassProvider>{ provide: OAuthService, useClass: OAuthService },
        <ClassProvider>{ provide: AuthStrategyToken, useClass: OIDCAuthStrategy, multi: true },
        <ClassProvider>{ provide: AuthStrategyToken, useClass: PasswordAuthStrategy, multi: true },
        <ClassProvider>{ provide: ConfigValidatorToken, useClass: OIDCConfigValidatorService, multi: false },
        <ClassProvider>{ provide: CheckSessionIFrame, useClass: CheckSessionIFrame },
        <ValueProvider>{ provide: UserProvidedConfig, useValue: config },
        <FactoryProvider>{ provide: BaseOAuthConfig, useFactory: configFactory, deps: [UserProvidedConfig, LogServiceToken, ConfigValidatorToken] },
        <FactoryProvider>{ provide: SelectedAuthStrategyToken, useFactory: authStrategyFactory, deps: [AuthStrategyToken, BaseOAuthConfig]},
        <FactoryProvider>{ provide: LogServiceToken, useFactory: config.logFactory }
      ]
    };
  }
}

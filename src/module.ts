import { NgModule, ModuleWithProviders, ClassProvider, ValueProvider, FactoryProvider } 
  from "@angular/core";
import { CommonModule } from "@angular/common";

import { OAuthService } from './oauth-service';
import { BaseAuthStrategy, AuthStrategyToken } from './base-auth-strategy';
import { OIDCAuthStrategy } from './oidc-auth-strategy';
import { PasswordAuthStrategy } from './password-auth-strategy';
import { IOAuthConfig } from './models/i';
import { OIDCConfig, PasswordConfig, ConfigToken, BaseOAuthConfig, UserProvidedConfig } from './models';
import { CheckSessionIFrame } from './check-session-iframe';
import { LogServiceToken } from './i';
import { AuthStrategyFactory } from './auth-strategy-factory';
import { configFactory } from './config-factory';

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
        <ClassProvider>{ provide: CheckSessionIFrame, useClass: CheckSessionIFrame },
        <ClassProvider>{ provide: AuthStrategyFactory, useClass: AuthStrategyFactory },
        <ValueProvider>{ provide: UserProvidedConfig, useValue: config },
        <FactoryProvider>{ provide: BaseOAuthConfig, useFactory: configFactory, deps: [UserProvidedConfig, config.log] },
        <ValueProvider>{ provide: LogServiceToken, useValue: config.log }
      ]
    };
  }
}

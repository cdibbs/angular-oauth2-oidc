import { NgModule, ModuleWithProviders, ClassProvider, ValueProvider, FactoryProvider } 
  from "@angular/core";
import { CommonModule } from "@angular/common";

import { OAuthService } from './src/oauth-service';
import { BaseAuthStrategy } from './src/base-auth-strategy';
import { OIDCAuthStrategy } from './src/oidc-auth-strategy';
import { PasswordAuthStrategy } from './src/password-auth-strategy';
import { BaseOAuthConfig, OIDCConfig, PasswordConfig } from './src/models';

export * from './src/oauth-service';
export * from './src/models';
export * from './src/models/i';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class OAuthModule {
  static forRoot<T extends BaseOAuthConfig>(
    config: BaseOAuthConfig): ModuleWithProviders {

    return <ModuleWithProviders>{
      ngModule: OAuthModule,
      providers: [
        <ValueProvider>{ provide: BaseOAuthConfig, useValue: config },
        <ClassProvider>{ provide: OAuthService, useClass: OAuthService },
        <ClassProvider>{ provide: OIDCAuthStrategy, useClass: OIDCAuthStrategy },
        <ClassProvider>{ provide: PasswordAuthStrategy, useClass: PasswordAuthStrategy }
      ]
    };
  }
}

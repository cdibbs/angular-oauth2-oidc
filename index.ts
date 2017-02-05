import { NgModule, ModuleWithProviders, ClassProvider, ValueProvider } from "@angular/core";
import { CommonModule } from "@angular/common";

import { OAuthService } from './src/oauth-service';
import { BaseOAuthConfig } from './src/models';

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
  static forRoot(config: BaseOAuthConfig): ModuleWithProviders {
    return {
      ngModule: OAuthModule,
      providers: [
        <ValueProvider>{ provide: BaseOAuthConfig, useValue: config },
        <ClassProvider>{ provide: OAuthService, useClass: OAuthService }
      ]
    };
  }
}

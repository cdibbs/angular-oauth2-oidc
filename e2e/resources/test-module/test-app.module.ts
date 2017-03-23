import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Inject, ValueProvider, ClassProvider, Provider, FactoryProvider } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpModule, Http, BrowserXhr } from '@angular/http';
import { RouterModule } from '@angular/router';

import { routes } from './test-app.routes';
import { TestAppComponent } from './test-app.component';
import { OAuthModule, OIDCConfig } from '../../../src'

///var es = new ErrorService();

@NgModule({
  declarations: [
    TestAppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes),
    OAuthModule.forRoot(<OIDCConfig>{})
  ],
  entryComponents: [],
  providers: [],
  bootstrap: [TestAppComponent]
})
export class TestAppModule {
  constructor() {}
}

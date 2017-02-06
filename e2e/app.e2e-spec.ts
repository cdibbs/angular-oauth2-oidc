import { TestBed, async, inject } from '@angular/core/testing';
import { Renderer, ClassProvider, ValueProvider, FactoryProvider } from '@angular/core';
import { Http, BaseRequestOptions, HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';

import { OAuthModule } from '../';
import { CheckSessionIFrame } from '../src/check-session-iframe';
import { OIDCAuthStrategy } from '../src/oidc-auth-strategy';
import { OAuthOIDCConfig } from '../src/models/oauth-oidc-config';
import { LogServiceToken } from '../src/i';

describe('BaseAuthStrategy', function() {
  let config = new OAuthOIDCConfig();
  config.discoveryDocumentUri = "http://localhost:3000";
  config.fallbackIssuer = "http://localhost:3000";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule, RouterModule.forRoot([]),
        OAuthModule.forRoot(config)
      ],
      providers: [
        <ValueProvider>{ provide: OAuthOIDCConfig, useValue: config },
        <ValueProvider>{ provide: APP_BASE_HREF, useValue : '/' },
        <ValueProvider>{ provide: LogServiceToken, useValue: console },
        <ClassProvider>{ provide: CheckSessionIFrame, useClass: CheckSessionIFrame },
        <ClassProvider>{ provide: Renderer, useClass: Renderer }
      ]
    });
  });

  it('should load the discovery document.', (done) => {
    inject([OIDCAuthStrategy], (strategy: OIDCAuthStrategy) => {
      strategy.loadDiscoveryDocument().then((d) => {
        console.log(d);
        expect(d).toBeDefined();
        done();
      });
    })();
  });
});

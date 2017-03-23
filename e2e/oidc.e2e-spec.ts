import { TestBed, async, inject } from '@angular/core/testing';
import { Renderer, ClassProvider, ValueProvider, FactoryProvider } from '@angular/core';
import { Http, BaseRequestOptions, HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';

import { OAuthModule, OAuthService } from '../src';
import { CheckSessionIFrame } from '../src/check-session-iframe';
import { SelectedAuthStrategyToken } from '../src/base-auth-strategy';
import { OIDCAuthStrategy } from '../src/oidc-auth-strategy';
import { DiscoveryDocument, OIDCConfig } from '../src/models';
import { LogServiceToken } from '../src/i';

describe('OIDCAuthStrategy', function() {
  let config = new OIDCConfig();
  //config.discoveryDocumentUri = "http://localhost:3000";
  config.kind = "oidc";
  config.fallbackIssuer = "http://localhost:3000";
  config.redirectUri = "http://localhost:3000";
  config.clientId = "TestApp";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        RouterModule.forRoot([]),
        OAuthModule.forRoot(config)
      ],
      providers: [
        <ValueProvider>{ provide: APP_BASE_HREF, useValue : '/' },
      ]
    });
  });

  it('should load the discovery document.', (done) => {
    inject([OAuthService], (svc: OAuthService<OIDCConfig>) => {
      svc.loadDiscoveryDocument().then((d: DiscoveryDocument) => {
        expect(d).toBeDefined();
        expect(svc.strategy.loginUrl).toBe(d.authorization_endpoint);
        expect(svc.strategy.logoutUrl).toBe(d.end_session_endpoint);
        done();
      });
    })();
  });

  it('should refresh session.', (done) => {
    inject([OAuthService], (svc: OAuthService<OIDCConfig>) => {
      svc.loadDiscoveryDocument().then((d: DiscoveryDocument) => {
        expect(d).toBeDefined();
        return svc.refreshSession(1000).toPromise();
      }).then((r) => {
        console.log("refresh response: ", r);
        done();
      }).catch((e) => { 
        fail(`Caught exception refreshing session: ${e}.`);
        done();
      });
    })();
  });
});

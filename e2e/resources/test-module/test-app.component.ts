import { Component, Inject, Output, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { OAuthService, OIDCConfig } from '../../../src';

@Component({
  selector: '[app-root]',
  host: {
    '(window:keydown)' : 'oauthService.bump()',
    '(window.mousemove)' : 'oauthService.bump()'
  },
  templateUrl: './test-app.component.html',
  styleUrls: []
})
export class TestAppComponent {
  constructor(
    private oauthService: OAuthService<OIDCConfig>
  ) {
    this.oauthService.SessionEvents.subscribe(e => { console.log(e); });

    this.oauthService.completeLoginFlow()
      .then((jwt) => {
        console.log("jwt received", jwt);
      })
      .catch((nope) => { 
        console.warn(nope);
      });
  }

  login(): void {
    this.oauthService.initiateLoginFlow();
  }

  logout(): void { this.oauthService.logOut(false); }

  title = 'Test Module';
}

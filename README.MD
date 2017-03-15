# angular-oauth2-oidc

Support for OAuth 2 and OpenId Connect (OIDC) in Angular.

## Credits

- angular-oauth2-oidc: https://github.com/manfredsteyer/angular-oauth2-oidc
- generator-angular2-library: https://github.com/jvandemo/generator-angular2-library

## Tested Environment

Successfully tested with the Angular 2.x and it's Router, PathLocationStrategy and CommonJS-Bundling via webpack.

## Features

- Logging in via OAuth2 and OpenId Connect (OIDC) Implicit Flow (where user is redirected to Identity Provider)
- "Logging in" via Password Flow (where user enters his/her password into the client)
- Using OIDC is optional
- Token Refresh for Password Flow
- IFrame refresh for Implicit Flow (implicit Flow doesn't allow for refresh tokens by design)
- Querying Userinfo Endpoint
- Querying Discovery Document to ease configuration
- Validating claims of the id_token regarding the specs (aud, iss, nbf, exp, at_hash)
- Hook for validating the signature of the received id_token
- Single-Sign-Out by redirecting to the auth-server's logout-endpoint

## Resources

- Sources of this lib: https://github.com/cdibbs/angular-oauth2-oidc

## Setup Provider for OAuthService

```typescript
import { OAuthModule } from 'angular-oauth2-oidc';
[...]

@NgModule({
  imports: [ 
    [...]
    HttpModule,
    OAuthModule.forRoot(oauthConfig)
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    [...]
  ],
  bootstrap: [
    AppComponent 
  ]
})
export class AppModule {
}

``` 

Keeping the session alive requires monitoring user activity. This can be done with the OAuthService's bump() method:
```typescript
import { OAuthService, OIDCConfig } from 'angular-oauth2-oidc';

@Component({
  selector: '[app-root]',
  host: { 
    '(window:keydown)' : 'oauthService.bump();',
    '(window:mousemove)' : 'oauthService.bump();'
  },
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private oauthService: OAuthService<OIDCConfig>,
    // ...
```


## Using Implicit Flow

This section shows how to use the implicit flow (redirection to external oauth login).

In a sensible component for your app, probably app.component like shown above, import `OAuthService<OIDCConfig>`.
Then, you can access that property and its methods in your template like this:

```html
<button (click)='oauthService.initiateLoginFlow()'>Log In</button>
```

That begins the flow. To complete the flow, you must configure a return component to await redirection
from the OID server back to your app:

```typescript
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private oauthService: OAuthService<OIDCConfig>
  ) {
    oauthService.completeLoginFlow();
  }
```
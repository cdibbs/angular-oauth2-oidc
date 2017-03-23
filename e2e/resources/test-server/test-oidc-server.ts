import { Provider } from 'oidc-provider';
import { config, clients } from './test-oidc-server-config';

const issuer = 'http://localhost:3000';

let oidc = new Provider(issuer, config);
oidc
  .initialize({ clients: clients })
  .then(() => oidc.app.listen(3000));
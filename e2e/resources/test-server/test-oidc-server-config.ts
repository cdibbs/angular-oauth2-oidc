export let clients = [{
  client_id: 'e2eTestOidcClient',
  client_secret: '91c0fabd17a9db3cfe53f28a10728e39b7724e234ecd78dba1fb05b909fb4ed98c476afc50a634d52808ad3cb2ea744bc8c3b45b7149ec459b5c416a6e8db242',
  grant_types: ['client_credentials', 'refresh_token', 'authorization_code'],
  redirect_uris: ['http://sso-client.dev/providers/7/open_id', 'http://sso-client.dev/providers/8/open_id'],
}];

export let config = {
  acrValues: ['session'],
  cookies: {
    long: { signed: true },
    short: { signed: true },
  },
  discovery: {
    service_documentation: "http://example.com",
    version: "1.0.0",
  },
  claims: {
    amr: null,
    address: ['address'],
    email: ['email', 'email_verified'],
    phone: ['phone_number', 'phone_number_verified'],
    profile: ['birthdate', 'family_name', 'gender', 'given_name', 'locale', 'middle_name', 'name',
      'nickname', 'picture', 'preferred_username', 'profile', 'updated_at', 'website', 'zoneinfo'],
  },
  features: {
    devInteractions: false,
    claimsParameter: true,
    clientCredentials: true,
    encryption: true,
    introspection: true,
    registration: true,
    registrationManagement: false,
    request: true,
    requestUri: true,
    revocation: true,
    sessionManagement: true,
    backchannelLogout: true,
  },
  subjectTypes: ['public', 'pairwise'],
  pairwiseSalt: 'da1c442b365b563dfc121f285a11eedee5bbff7110d55c88',
  interactionUrl: function interactionUrl(interaction) { // eslint-disable-line no-unused-vars
    // this => koa context;
    return `/interaction/${this.oidc.uuid}`;
  },
};
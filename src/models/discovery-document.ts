export class DiscoveryDocument {
    /** AKA the login URI */
    public authorization_endpoint: string;

    /** AKA the logoutUri */
    public end_session_endpoint: string;

    /** TODO */
    public grant_types_supported: string[];

    /** AKA the base URI of the auth server */
    public issuer: string;

    public token_endpoint: string;

    public userinfo_endpoint: string;

    public check_session_iframe: string;
}
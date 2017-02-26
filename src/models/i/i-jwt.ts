export interface IJWT {
    sub: string; 

    /** The id provider */
    idp: string;

    aud: string;
    iss: string;
    nonce: string;

    /** The roles for which the user is authorized. */
    role: string | string[];

    /** The scopes wherein the token is applicable. */
    scope: string | string[];

    /** The client id of the application. */
    client_id: string;
}
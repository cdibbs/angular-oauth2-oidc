import { ILogService } from "./i";
import { IOAuthConfig } from "./models/i";
import { OIDCConfig, BaseOAuthConfig, PasswordConfig, UserProvidedConfig } from './models';

/**
 * Ensures final, injected config has default options + user options.
 * @param userConfig The user-supplied options, minus defaults.
 * @param log Logging
 * @return An implementation of IOAuthConfig with defaults and user-specified options.
 */
export function configFactory(
    userConfig: IOAuthConfig,
    log: ILogService): IOAuthConfig {
    switch (userConfig.kind) {
        case "oidc":
            return extend(new OIDCConfig(), userConfig);
        case "password":
            return extend(new PasswordConfig(), userConfig);
        default:
            log.warn(`Unrecognized config type ${userConfig.kind}.`);
            return extend(new BaseOAuthConfig(), userConfig);
    }
}

/**
 * Quick and dirty shallow extend
 */
export function extend<A>(a: A): A;
export function extend<A, B>(a: A, b: B): A & B;
export function extend<A, B, C>(a: A, b: B, c: C): A & B & C;
export function extend<A, B, C, D>(a: A, b: B, c: C, d: D): A & B & C & D;
export function extend(...args: any[]): any {
    const newObj = {};
    for (const obj of args) {
        for (const key in obj) {
            //copy all the fields
            newObj[key] = obj[key];
        }
    }
    return newObj;
};
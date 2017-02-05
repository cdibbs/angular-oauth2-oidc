import { Observable } from 'rxjs';

export interface IOAuthService {
    refreshSession(): Observable<any>;

    /**
     * This will initiate the login process for the provided strategy. If the strategy
     * returns a Promise for a user profile, so will this method. Otherwise, it returns
     * a rejected promise that should be ignored.
     * @returns A promise for a user profile. Fulfilled iff given flow supports async auth.
     */
    initiateLoginFlow(): Promise<any>;
}
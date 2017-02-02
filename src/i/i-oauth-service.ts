
export interface IOAuthService {
    refreshSession(): Promise<any>;

    /**
     * This will initiate the login process for the provided strategy. If the strategy
     * returns a Promise for a user profile, so will this method. Otherwise, it returns
     * a rejected promise that should be ignored.
     * @returns A promise for a user profile.
     */
    initiateLoginFlow(): Promise<any>;
}
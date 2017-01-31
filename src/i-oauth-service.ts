export interface IOAuthService {
    refreshSession(): Promise<any>;
}
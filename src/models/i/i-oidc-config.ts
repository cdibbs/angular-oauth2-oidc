import { IOAuthConfig } from './i-oauth-config';

export interface IOIDCConfig extends IOAuthConfig {
    useIFrameRefresh: boolean;
    iFrameRefreshUri: string;
}
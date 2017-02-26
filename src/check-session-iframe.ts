import { Inject, Injectable } from '@angular/core';
import { ILogService, LogServiceToken } from './i';
import { Observable, Observer, Subscription, Subscriber } from 'rxjs';

// Inspired by, and thanks to: https://github.com/IdentityModel/oidc-client-js/blob/dev/src/IFrameWindow.js
@Injectable()
export class CheckSessionIFrame {
    private documentLoaded$: Observable<any>;
    private documentLoadedSubscriber: Subscriber<any>;
    private timer: Observable<any>;
    private timerSubscription: Subscription;
    private iframe: HTMLIFrameElement;
    private removeWindowListener: Function;

    constructor(
        @Inject(LogServiceToken) private log: ILogService)
    {
        this.documentLoaded$ = new Observable((subscriber: Subscriber<any>) => {
            console.log(subscriber);
            this.documentLoadedSubscriber = subscriber;
        }).share();
        this.setupIFrame();
    }

    public navigate(url: string, timeout: number): Observable<any>  {
        this.log.debug(`${this.constructor.name} ${url} ${timeout}`);
        this.timer = Observable.timer(timeout);
        this.timerSubscription = this.timer.subscribe(this.timeout.bind(this));
        this.iframe.src = url;
        this.iframe.onload = this.success.bind(this);
        return this.documentLoaded$;
    }

    protected timeout(timePassed: number): void {
        this.documentLoadedSubscriber.error(`Request timed out after ${timePassed}ms.`);
        this.cleanup();
    }

    protected success(data): void {
        this.log.debug(`${this.constructor.name}`);
        this.cleanup();
    }

    private cleanup(): void {
        this.timerSubscription.unsubscribe();
        this.removeWindowListener();
        this.removeIFrame();
    }

    protected setupIFrame(): void {
        this.iframe = window.document.createElement("iframe");
        this.iframe.style.display = "none";
        window.document.body.appendChild(this.iframe);
    }

    protected removeIFrame(): void {
        window.document.body.removeChild(this.iframe);
    }
}
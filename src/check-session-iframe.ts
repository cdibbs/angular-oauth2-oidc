import { Inject, Injectable, Renderer } from '@angular/core';
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
        @Inject(LogServiceToken) private log: ILogService,
        private renderer: Renderer)
    {
        this.documentLoaded$ = new Observable((subscriber: Subscriber<any>) => {
            console.log(subscriber);
            this.documentLoadedSubscriber = subscriber;
        }).share();
        this.setupIFrame();
    }

    public navigate(url: string, timeout: number): Observable<any>  {
        if (!this.removeWindowListener) {
            this.removeWindowListener = this.setupGlobalListener("window", "message", this.message);
        }
        this.log.debug(`${this.constructor.name}.${this.message.name}`);
        this.timer = Observable.timer(timeout);
        this.timerSubscription = this.timer.subscribe(((self) => (t: number) => self.timeout.call(self, t))(this));
        this.iframe.src = url;
        return this.documentLoaded$;
    }

    protected timeout(timePassed: number): void {
        this.documentLoadedSubscriber.error(`Request timed out after ${timePassed}ms.`);
        this.cleanup();
    }

    protected success(data): void {
        this.log.debug(`${this.constructor.name}.${this.message.name}`);
        this.cleanup();
    }

    private cleanup(): void {
        this.timerSubscription.unsubscribe();
        this.removeWindowListener();
        this.removeIFrame
    }

    protected message(e): void {
        this.log.debug(`${this.constructor.name}.${this.message.name}`);

    }

    protected setupIFrame(): void {
        this.iframe = window.document.createElement("iframe");
        this.iframe.style.display = "none";
        window.document.body.appendChild(this.iframe);
    }

    protected removeIFrame(): void {
        window.document.body.removeChild(this.iframe);
    }

    protected setupGlobalListener(target: string, name: string, callback: Function): Function {
        return this.renderer.listenGlobal(target, name, callback);
    }
}
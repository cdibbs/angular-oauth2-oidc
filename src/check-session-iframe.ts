import { Renderer } from '@angular/core';
import { ILogService } from './i';
import { Observable, Observer, Subscription } from 'rxjs';

// Inspired by, and thanks to: https://github.com/IdentityModel/oidc-client-js/blob/dev/src/IFrameWindow.js
export class CheckSessionIFrame {
    private documentLoaded$: Observable<any>;
    private documentLoadedSender: Observer<any>;
    private timer: Observable<any>;
    private timerSubscription: Subscription;
    private iframe: HTMLIFrameElement;
    private removeWindowListener: Function;

    constructor(private log: ILogService, private renderer: Renderer) {
        this.removeWindowListener = renderer.listenGlobal("window", "message", this.message);
        this.documentLoaded$ = Observable.create((sender: Observer<any>) => {
            this.documentLoadedSender = sender;
        }).publish().connect();
        this.setupIFrame();
    }

    public navigate(url: string, timeout: number): Observable<any>  {
        this.log.debug(`${this.constructor.name}.${this.message.name}`);
        this.timer = Observable.timer(timeout);
        this.timerSubscription = this.timer.subscribe(this.timeout);
        this.iframe.src = url;
        return this.documentLoaded$;
    }

    protected timeout(timePassed: number): void {
        this.cleanup();
        this.documentLoadedSender.error(`Request timed out after ${timePassed}ms.`);
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
}
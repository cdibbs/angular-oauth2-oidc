var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Inject, Injectable } from '@angular/core';
import { LogServiceToken } from './i';
import { Observable } from 'rxjs';
let CheckSessionIFrame = class CheckSessionIFrame {
    /**
     * @param {?} log
     */
    constructor(log) {
        this.log = log;
        this.documentLoaded$ = new Observable((subscriber) => {
            console.log(subscriber);
            this.documentLoadedSubscriber = subscriber;
        }).share();
        this.setupIFrame();
    }
    /**
     * @param {?} url
     * @param {?} timeout
     * @return {?}
     */
    navigate(url, timeout) {
        this.log.debug(`${this.constructor.name} ${url} ${timeout}`);
        this.timer = Observable.timer(timeout);
        this.timerSubscription = this.timer.subscribe(this.timeout.bind(this));
        this.iframe.src = url;
        this.iframe.onload = this.success.bind(this);
        return this.documentLoaded$;
    }
    /**
     * @param {?} timePassed
     * @return {?}
     */
    timeout(timePassed) {
        this.documentLoadedSubscriber.error(`Request timed out after ${timePassed}ms.`);
        this.cleanup();
    }
    /**
     * @param {?} data
     * @return {?}
     */
    success(data) {
        this.log.debug(`${this.constructor.name}`);
        this.cleanup();
    }
    /**
     * @return {?}
     */
    cleanup() {
        this.timerSubscription.unsubscribe();
        this.removeWindowListener();
        this.removeIFrame();
    }
    /**
     * @return {?}
     */
    setupIFrame() {
        this.iframe = window.document.createElement("iframe");
        this.iframe.style.display = "none";
        window.document.body.appendChild(this.iframe);
    }
    /**
     * @return {?}
     */
    removeIFrame() {
        window.document.body.removeChild(this.iframe);
    }
};
CheckSessionIFrame = __decorate([
    Injectable(),
    __param(0, Inject(LogServiceToken)),
    __metadata("design:paramtypes", [Object])
], CheckSessionIFrame);
export { CheckSessionIFrame };
function CheckSessionIFrame_tsickle_Closure_declarations() {
    /** @type {?} */
    CheckSessionIFrame.prototype.documentLoaded$;
    /** @type {?} */
    CheckSessionIFrame.prototype.documentLoadedSubscriber;
    /** @type {?} */
    CheckSessionIFrame.prototype.timer;
    /** @type {?} */
    CheckSessionIFrame.prototype.timerSubscription;
    /** @type {?} */
    CheckSessionIFrame.prototype.iframe;
    /** @type {?} */
    CheckSessionIFrame.prototype.removeWindowListener;
}
//# sourceMappingURL=C:/cygwin64/home/cdibbs/git/angular-oauth2-oidc/src/check-session-iframe.js.map
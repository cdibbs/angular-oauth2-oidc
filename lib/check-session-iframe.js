import { Inject, Injectable } from '@angular/core';
import { LogServiceToken } from './i';
import { Observable } from 'rxjs';
var CheckSessionIFrame = (function () {
    /**
     * @param {?} log
     */
    function CheckSessionIFrame(log) {
        var _this = this;
        this.log = log;
        this.documentLoaded$ = new Observable(function (subscriber) {
            console.log(subscriber);
            _this.documentLoadedSubscriber = subscriber;
        }).share();
    }
    /**
     * @param {?} url
     * @param {?} timeout
     * @return {?}
     */
    CheckSessionIFrame.prototype.navigate = function (url, timeout) {
        this.setupIFrame();
        this.log.debug(this.constructor.name + " " + url + " " + timeout);
        this.timer = Observable.timer(timeout);
        this.timerSubscription = this.timer.subscribe(this.timeout.bind(this));
        window["oidcRefreshComplete"] = this.refreshComplete.bind(this);
        this.iframe.src = url;
        this.iframe.onload = this.success.bind(this);
        return this.documentLoaded$;
    };
    /**
     * @return {?}
     */
    CheckSessionIFrame.prototype.refreshComplete = function () {
        this.log.debug("Session refresh complete.");
        this.cleanup();
    };
    /**
     * @param {?} timePassed
     * @return {?}
     */
    CheckSessionIFrame.prototype.timeout = function (timePassed) {
        this.documentLoadedSubscriber.error("Request timed out after " + timePassed + "ms.");
        this.cleanup();
    };
    /**
     * @return {?}
     */
    CheckSessionIFrame.prototype.success = function () {
        this.log.debug("" + this.constructor.name);
        this.documentLoadedSubscriber.next();
        this.cleanup();
    };
    /**
     * @return {?}
     */
    CheckSessionIFrame.prototype.cleanup = function () {
        this.timerSubscription.unsubscribe();
        this.removeIFrame();
    };
    /**
     * @return {?}
     */
    CheckSessionIFrame.prototype.setupIFrame = function () {
        this.iframe = window.document.createElement("iframe");
        this.iframe.style.display = "none";
        window.document.body.appendChild(this.iframe);
    };
    /**
     * @return {?}
     */
    CheckSessionIFrame.prototype.removeIFrame = function () {
        window.document.body.removeChild(this.iframe);
    };
    return CheckSessionIFrame;
}());
export { CheckSessionIFrame };
CheckSessionIFrame.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
CheckSessionIFrame.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [LogServiceToken,] },] },
]; };
function CheckSessionIFrame_tsickle_Closure_declarations() {
    /** @type {?} */
    CheckSessionIFrame.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    CheckSessionIFrame.ctorParameters;
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
    CheckSessionIFrame.prototype.log;
}
//# sourceMappingURL=C:/cygwin64/home/cdibbs/git/angular-oauth2-oidc/lib/check-session-iframe.js.map
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
import { AuthStrategyToken } from './base-auth-strategy';
var AuthStrategyFactory = (function () {
    /**
     * @param {?} strategies
     */
    function AuthStrategyFactory(strategies) {
        this.strategies = strategies;
    }
    /**
     * @param {?} config
     * @return {?}
     */
    AuthStrategyFactory.prototype.get = function (config) {
        return this.strategies.filter(function (s) { return s.kind == config.kind; })[0];
    };
    return AuthStrategyFactory;
}());
AuthStrategyFactory = __decorate([
    Injectable(),
    __param(0, Inject(AuthStrategyToken)),
    __metadata("design:paramtypes", [Array])
], AuthStrategyFactory);
export { AuthStrategyFactory };
//# sourceMappingURL=D:/temp/angular-oauth2-oidc/src/auth-strategy-factory.js.map
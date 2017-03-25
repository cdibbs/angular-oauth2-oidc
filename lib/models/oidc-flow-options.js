var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { BaseFlowOptions } from './base-flow-options';
var OIDCFlowOptions = (function (_super) {
    __extends(OIDCFlowOptions, _super);
    function OIDCFlowOptions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return OIDCFlowOptions;
}(BaseFlowOptions));
export { OIDCFlowOptions };
//# sourceMappingURL=C:/cygwin64/home/cdibbs/git/angular-oauth2-oidc/lib/models/oidc-flow-options.js.map
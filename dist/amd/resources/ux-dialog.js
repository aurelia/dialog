define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UxDialog = /** @class */ (function () {
        function UxDialog() {
        }
        /**
         * @internal
         */
        UxDialog.$view = "<template><slot></slot></template>";
        /**
         * @internal
         */
        UxDialog.$resource = 'ux-dialog';
        return UxDialog;
    }());
    exports.UxDialog = UxDialog;
});

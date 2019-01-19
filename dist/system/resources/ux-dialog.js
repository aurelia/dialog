System.register([], function (exports_1, context_1) {
    "use strict";
    var UxDialog;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            UxDialog = /** @class */ (function () {
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
            exports_1("UxDialog", UxDialog);
        }
    };
});

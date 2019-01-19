System.register([], function (exports_1, context_1) {
    "use strict";
    var UxDialogBody;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            UxDialogBody = /** @class */ (function () {
                function UxDialogBody() {
                }
                /**
                 * @internal
                 */
                UxDialogBody.$view = "<template><slot></slot></template>";
                /**
                 * @internal
                 */
                UxDialogBody.$resource = 'ux-dialog-body';
                return UxDialogBody;
            }());
            exports_1("UxDialogBody", UxDialogBody);
        }
    };
});

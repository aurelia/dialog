System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var DefaultDialogSettings;
    return {
        setters: [],
        execute: function () {
            /**
             * @internal
             */
            DefaultDialogSettings = /** @class */ (function () {
                function DefaultDialogSettings() {
                    this.lock = true;
                    this.startingZIndex = 1000;
                    this.centerHorizontalOnly = false;
                    this.rejectOnCancel = false;
                    this.ignoreTransitions = false;
                }
                return DefaultDialogSettings;
            }());
            exports_1("DefaultDialogSettings", DefaultDialogSettings);
        }
    };
});

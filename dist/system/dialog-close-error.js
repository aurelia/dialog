System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /**
     * @internal
     */
    function createDialogCloseError(output) {
        var error = new Error();
        error.wasCancelled = false;
        error.output = output;
        return error;
    }
    exports_1("createDialogCloseError", createDialogCloseError);
    return {
        setters: [],
        execute: function () {
        }
    };
});

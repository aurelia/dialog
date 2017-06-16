System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /**
     * @internal
     */
    function createDialogCancelError(output) {
        var error = new Error('Operation cancelled.');
        error.wasCancelled = true;
        error.output = output;
        return error;
    }
    exports_1("createDialogCancelError", createDialogCancelError);
    return {
        setters: [],
        execute: function () {
        }
    };
});

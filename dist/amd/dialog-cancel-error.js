define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @internal
     */
    function createDialogCancelError(output) {
        var error = new Error('Operation cancelled.');
        error.wasCancelled = true;
        error.output = output;
        return error;
    }
    exports.createDialogCancelError = createDialogCancelError;
});

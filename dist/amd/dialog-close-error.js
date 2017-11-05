define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @internal
     */
    function createDialogCloseError(output) {
        var error = new Error();
        error.wasCancelled = false;
        error.output = output;
        return error;
    }
    exports.createDialogCloseError = createDialogCloseError;
});

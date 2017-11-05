/**
 * @internal
 */
export function createDialogCloseError(output) {
    var error = new Error();
    error.wasCancelled = false;
    error.output = output;
    return error;
}

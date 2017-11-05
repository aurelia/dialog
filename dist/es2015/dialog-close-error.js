/**
 * @internal
 */
export function createDialogCloseError(output) {
    const error = new Error();
    error.wasCancelled = false;
    error.output = output;
    return error;
}

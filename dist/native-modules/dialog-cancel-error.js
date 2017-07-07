/**
 * @internal
 */
export function createDialogCancelError(output) {
    var error = new Error('Operation cancelled.');
    error.wasCancelled = true;
    error.output = output;
    return error;
}

/**
 * @internal
 */
export function createDialogCancelError(output) {
    const error = new Error('Operation cancelled.');
    error.wasCancelled = true;
    error.output = output;
    return error;
}

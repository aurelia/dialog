/**
 * The error is thrown when the dialog is closed with the `DialogController.prototype.error` method.
 */
export interface DialogCloseError extends Error {
    reason: any;
}

/**
 * @internal
 */
export function createDialogCloseError(reason: any): DialogCloseError {
    const error = new Error() as DialogCloseError;
    error.reason = reason;
    return error;
}

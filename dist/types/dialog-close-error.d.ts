/**
 * The error thrown when the dialog is closed with the `DialogController.prototype.error` method.
 */
export interface DialogCloseError extends Error {
    wasCancelled: false;
    output: any;
}

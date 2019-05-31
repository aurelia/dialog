/**
 * The error thrown when a "cancel" occurs and DialogSettings.rejectOnCancel is set to "true".
 */
export interface DialogCancelError extends Error {
    wasCancelled: true;
    output?: any;
}

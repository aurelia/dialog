/**
 * The error thrown when the dialog is closed with the `DialogController.prototype.error` method.
 */
export interface DialogCloseError extends Error {
  wasCancelled: false;
  output: any;
}

/**
 * @internal
 */
export function createDialogCloseError(output: any): DialogCloseError {
  const error = new Error() as DialogCloseError;
  error.wasCancelled = false;
  error.output = output;
  return error;
}

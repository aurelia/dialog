/**
 * The error thrown when a "cancel" occurs and DialogSettings.rejectOnCancel is set to "true".
 */
export interface DialogCancelError extends Error {
  wasCancelled: true;
  output?: any;
}

/**
 * @internal
 */
export function createDialogCancelError(output?: any): DialogCancelError {
  const error = new Error('Operation cancelled.') as DialogCancelError;
  error.wasCancelled = true;
  error.output = output;
  return error;
}

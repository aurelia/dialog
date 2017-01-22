export interface DialogCancelError extends Error {
  wasCancelled: true;
  output?: any;
};

export function createDialogCancelError(output?: any): DialogCancelError {
  const error = new Error('Operation cancelled.') as DialogCancelError;
  error.wasCancelled = true;
  error.output = output;
  return error;
}

export class DialogCancelError extends Error {
  wasCancelled = true;
  reason: any;

  constructor(cancellationReason: any = null) {
    super('Operation cancelled.');
    this.reason = cancellationReason;
  }
}

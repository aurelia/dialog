export class DialogCancelError extends Error { // TODO: rework without extends!!!
  public readonly wasCancelled = true;
  public readonly reason: any;

  constructor(cancellationReason: any = null) {
    super('Operation cancelled.');
    this.reason = cancellationReason;
  }
}

export class DialogCancelError extends Error {
    wasCancelled = true;
    reason: any;

    constructor(cancellationReason: any = null) {
        super('Dialog cancelled.');
        this.reason = cancellationReason;
    }
}
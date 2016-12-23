export let DialogCancelError = class DialogCancelError extends Error {

    constructor(cancellationReason = null) {
        super('Dialog cancelled.');
        this.wasCancelled = true;
        this.reason = cancellationReason;
    }
};
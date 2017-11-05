import { Renderer } from './renderer';
import { invokeLifecycle } from './lifecycle';
import { createDialogCloseError } from './dialog-close-error';
import { createDialogCancelError } from './dialog-cancel-error';
/**
 * A controller object for a Dialog instance.
 */
export class DialogController {
    /**
     * Creates an instance of DialogController.
     */
    constructor(renderer, settings, resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
        this.settings = settings;
        this.renderer = renderer;
    }
    /**
     * @internal
     */
    releaseResources(result) {
        return invokeLifecycle(this.controller.viewModel || {}, 'deactivate', result)
            .then(() => this.renderer.hideDialog(this))
            .then(() => { this.controller.unbind(); });
    }
    /**
     * @internal
     */
    cancelOperation() {
        if (!this.settings.rejectOnCancel) {
            return { wasCancelled: true };
        }
        throw createDialogCancelError();
    }
    /**
     * Closes the dialog with a successful output.
     * @param output The returned success output.
     */
    ok(output) {
        return this.close(true, output);
    }
    /**
     * Closes the dialog with a cancel output.
     * @param output The returned cancel output.
     */
    cancel(output) {
        return this.close(false, output);
    }
    /**
     * Closes the dialog with an error output.
     * @param output A reason for closing with an error.
     * @returns Promise An empty promise object.
     */
    error(output) {
        const closeError = createDialogCloseError(output);
        return this.releaseResources(closeError).then(() => { this.reject(closeError); });
    }
    /**
     * Closes the dialog.
     * @param ok Whether or not the user input signified success.
     * @param output The specified output.
     * @returns Promise An empty promise object.
     */
    close(ok, output) {
        if (this.closePromise) {
            return this.closePromise;
        }
        const dialogResult = { wasCancelled: !ok, output };
        return this.closePromise = invokeLifecycle(this.controller.viewModel || {}, 'canDeactivate', dialogResult)
            .catch(reason => {
            this.closePromise = undefined;
            return Promise.reject(reason);
        }).then(canDeactivate => {
            if (!canDeactivate) {
                this.closePromise = undefined; // we are done, do not block consecutive calls
                return this.cancelOperation();
            }
            return this.releaseResources(dialogResult).then(() => {
                if (!this.settings.rejectOnCancel || ok) {
                    this.resolve(dialogResult);
                }
                else {
                    this.reject(createDialogCancelError(output));
                }
                return { wasCancelled: false };
            }).catch(reason => {
                this.closePromise = undefined;
                return Promise.reject(reason);
            });
        });
    }
}
/**
 * @internal
 */
// tslint:disable-next-line:member-ordering
DialogController.inject = [Renderer];

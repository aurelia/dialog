import { Renderer } from './renderer';
import { invokeLifecycle } from './lifecycle';
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
    releaseResources() {
        return invokeLifecycle(this.controller.viewModel || {}, 'deactivate')
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
     * Closes the dialog with an error result.
     * @param message An error message.
     * @returns Promise An empty promise object.
     */
    error(message) {
        return this.releaseResources().then(() => { this.reject(message); });
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
        return this.closePromise = invokeLifecycle(this.controller.viewModel || {}, 'canDeactivate').catch(reason => {
            this.closePromise = undefined;
            return Promise.reject(reason);
        }).then(canDeactivate => {
            if (!canDeactivate) {
                this.closePromise = undefined; // we are done, do not block consecutive calls
                return this.cancelOperation();
            }
            return this.releaseResources().then(() => {
                if (!this.settings.rejectOnCancel || ok) {
                    this.resolve({ wasCancelled: !ok, output });
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
DialogController.inject = [Renderer];

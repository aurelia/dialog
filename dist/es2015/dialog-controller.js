class Renderer {
    getDialogContainer() {
        throw new Error('DialogRenderer must implement getDialogContainer().');
    }
    showDialog(dialogController) {
        throw new Error('DialogRenderer must implement showDialog().');
    }
    hideDialog(dialogController) {
        throw new Error('DialogRenderer must implement hideDialog().');
    }
}

function createDialogCancelError(output) {
    const error = new Error('Operation cancelled.');
    error.wasCancelled = true;
    error.output = output;
    return error;
}

function createDialogCloseError(output) {
    const error = new Error();
    error.wasCancelled = false;
    error.output = output;
    return error;
}

function invokeLifecycle(instance, name, model) {
    if (typeof instance[name] === 'function') {
        return new Promise(resolve => {
            resolve(instance[name](model));
        }).then(result => {
            if (result !== null && result !== undefined) {
                return result;
            }
            return true;
        });
    }
    return Promise.resolve(true);
}

class DialogController {
    constructor(renderer, settings, resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
        this.settings = settings;
        this.renderer = renderer;
    }
    releaseResources(result) {
        return invokeLifecycle(this.controller.viewModel || {}, 'deactivate', result)
            .then(() => this.renderer.hideDialog(this))
            .then(() => {
            this.controller.unbind();
        });
    }
    cancelOperation() {
        if (!this.settings.rejectOnCancel) {
            return { wasCancelled: true };
        }
        throw createDialogCancelError();
    }
    ok(output) {
        return this.close(true, output);
    }
    cancel(output) {
        return this.close(false, output);
    }
    error(output) {
        const closeError = createDialogCloseError(output);
        return this.releaseResources(closeError).then(() => { this.reject(closeError); });
    }
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
                this.closePromise = undefined;
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
DialogController.inject = [Renderer];

export { DialogController as D, Renderer as R, createDialogCloseError as a, createDialogCancelError as c, invokeLifecycle as i };
//# sourceMappingURL=dialog-controller.js.map

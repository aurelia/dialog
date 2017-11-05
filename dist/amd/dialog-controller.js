define(["require", "exports", "./renderer", "./lifecycle", "./dialog-close-error", "./dialog-cancel-error"], function (require, exports, renderer_1, lifecycle_1, dialog_close_error_1, dialog_cancel_error_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A controller object for a Dialog instance.
     */
    var DialogController = /** @class */ (function () {
        /**
         * Creates an instance of DialogController.
         */
        function DialogController(renderer, settings, resolve, reject) {
            this.resolve = resolve;
            this.reject = reject;
            this.settings = settings;
            this.renderer = renderer;
        }
        /**
         * @internal
         */
        DialogController.prototype.releaseResources = function (result) {
            var _this = this;
            return lifecycle_1.invokeLifecycle(this.controller.viewModel || {}, 'deactivate', result)
                .then(function () { return _this.renderer.hideDialog(_this); })
                .then(function () { _this.controller.unbind(); });
        };
        /**
         * @internal
         */
        DialogController.prototype.cancelOperation = function () {
            if (!this.settings.rejectOnCancel) {
                return { wasCancelled: true };
            }
            throw dialog_cancel_error_1.createDialogCancelError();
        };
        /**
         * Closes the dialog with a successful output.
         * @param output The returned success output.
         */
        DialogController.prototype.ok = function (output) {
            return this.close(true, output);
        };
        /**
         * Closes the dialog with a cancel output.
         * @param output The returned cancel output.
         */
        DialogController.prototype.cancel = function (output) {
            return this.close(false, output);
        };
        /**
         * Closes the dialog with an error output.
         * @param output A reason for closing with an error.
         * @returns Promise An empty promise object.
         */
        DialogController.prototype.error = function (output) {
            var _this = this;
            var closeError = dialog_close_error_1.createDialogCloseError(output);
            return this.releaseResources(closeError).then(function () { _this.reject(closeError); });
        };
        /**
         * Closes the dialog.
         * @param ok Whether or not the user input signified success.
         * @param output The specified output.
         * @returns Promise An empty promise object.
         */
        DialogController.prototype.close = function (ok, output) {
            var _this = this;
            if (this.closePromise) {
                return this.closePromise;
            }
            var dialogResult = { wasCancelled: !ok, output: output };
            return this.closePromise = lifecycle_1.invokeLifecycle(this.controller.viewModel || {}, 'canDeactivate', dialogResult)
                .catch(function (reason) {
                _this.closePromise = undefined;
                return Promise.reject(reason);
            }).then(function (canDeactivate) {
                if (!canDeactivate) {
                    _this.closePromise = undefined; // we are done, do not block consecutive calls
                    return _this.cancelOperation();
                }
                return _this.releaseResources(dialogResult).then(function () {
                    if (!_this.settings.rejectOnCancel || ok) {
                        _this.resolve(dialogResult);
                    }
                    else {
                        _this.reject(dialog_cancel_error_1.createDialogCancelError(output));
                    }
                    return { wasCancelled: false };
                }).catch(function (reason) {
                    _this.closePromise = undefined;
                    return Promise.reject(reason);
                });
            });
        };
        /**
         * @internal
         */
        // tslint:disable-next-line:member-ordering
        DialogController.inject = [renderer_1.Renderer];
        return DialogController;
    }());
    exports.DialogController = DialogController;
});

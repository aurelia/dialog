System.register(["./renderer", "./lifecycle", "./dialog-cancel-error"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var renderer_1, lifecycle_1, dialog_cancel_error_1, DialogController;
    return {
        setters: [
            function (renderer_1_1) {
                renderer_1 = renderer_1_1;
            },
            function (lifecycle_1_1) {
                lifecycle_1 = lifecycle_1_1;
            },
            function (dialog_cancel_error_1_1) {
                dialog_cancel_error_1 = dialog_cancel_error_1_1;
            }
        ],
        execute: function () {
            /**
             * A controller object for a Dialog instance.
             */
            DialogController = (function () {
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
                DialogController.prototype.releaseResources = function () {
                    var _this = this;
                    return lifecycle_1.invokeLifecycle(this.controller.viewModel || {}, 'deactivate')
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
                 * Closes the dialog with an error result.
                 * @param message An error message.
                 * @returns Promise An empty promise object.
                 */
                DialogController.prototype.error = function (message) {
                    var _this = this;
                    return this.releaseResources().then(function () { _this.reject(message); });
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
                    return this.closePromise = lifecycle_1.invokeLifecycle(this.controller.viewModel || {}, 'canDeactivate').catch(function (reason) {
                        _this.closePromise = undefined;
                        return Promise.reject(reason);
                    }).then(function (canDeactivate) {
                        if (!canDeactivate) {
                            _this.closePromise = undefined; // we are done, do not block consecutive calls
                            return _this.cancelOperation();
                        }
                        return _this.releaseResources().then(function () {
                            if (!_this.settings.rejectOnCancel || ok) {
                                _this.resolve({ wasCancelled: !ok, output: output });
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
                return DialogController;
            }());
            /**
             * @internal
             */
            DialogController.inject = [renderer_1.Renderer];
            exports_1("DialogController", DialogController);
        }
    };
});

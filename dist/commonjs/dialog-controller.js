"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var renderer_1 = require("./renderer");
var lifecycle_1 = require("./lifecycle");
var dialog_cancel_error_1 = require("./dialog-cancel-error");
/**
 * A controller object for a Dialog instance.
 */
var DialogController = (function () {
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
exports.DialogController = DialogController;

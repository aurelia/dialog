import { Container } from 'aurelia-dependency-injection';
import { Origin } from 'aurelia-metadata';
import { CompositionEngine, ViewSlot } from 'aurelia-templating';
import { DefaultDialogSettings } from './dialog-settings';
import { createDialogCancelError } from './dialog-cancel-error';
import { invokeLifecycle } from './lifecycle';
import { DialogController } from './dialog-controller';
/* tslint:enable:max-line-length */
function whenClosed(onfulfilled, onrejected) {
    return this.then(function (r) { return r.wasCancelled ? r : r.closeResult; }).then(onfulfilled, onrejected);
}
function asDialogOpenPromise(promise) {
    promise.whenClosed = whenClosed;
    return promise;
}
/**
 * A service allowing for the creation of dialogs.
 */
var DialogService = /** @class */ (function () {
    function DialogService(container, compositionEngine, defaultSettings) {
        /**
         * The current dialog controllers
         */
        this.controllers = [];
        /**
         * Is there an open dialog
         */
        this.hasOpenDialog = false;
        this.hasActiveDialog = false;
        this.container = container;
        this.compositionEngine = compositionEngine;
        this.defaultSettings = defaultSettings;
    }
    DialogService.prototype.validateSettings = function (settings) {
        if (!settings.viewModel && !settings.view) {
            throw new Error('Invalid Dialog Settings. You must provide "viewModel", "view" or both.');
        }
    };
    // tslint:disable-next-line:max-line-length
    DialogService.prototype.createCompositionContext = function (childContainer, host, settings) {
        return {
            container: childContainer.parent,
            childContainer: childContainer,
            bindingContext: null,
            viewResources: null,
            model: settings.model,
            view: settings.view,
            viewModel: settings.viewModel,
            viewSlot: new ViewSlot(host, true),
            host: host
        };
    };
    DialogService.prototype.ensureViewModel = function (compositionContext) {
        if (typeof compositionContext.viewModel === 'function') {
            var moduleId = Origin.get(compositionContext.viewModel).moduleId;
            if (!moduleId) {
                return Promise.reject(new Error("Can not resolve \"moduleId\" of \"" + compositionContext.viewModel.name + "\"."));
            }
            compositionContext.viewModel = moduleId;
        }
        if (typeof compositionContext.viewModel === 'string') {
            return this.compositionEngine.ensureViewModel(compositionContext);
        }
        return Promise.resolve(compositionContext);
    };
    DialogService.prototype._cancelOperation = function (rejectOnCancel) {
        if (!rejectOnCancel) {
            return { wasCancelled: true };
        }
        throw createDialogCancelError();
    };
    // tslint:disable-next-line:max-line-length
    DialogService.prototype.composeAndShowDialog = function (compositionContext, dialogController) {
        var _this = this;
        if (!compositionContext.viewModel) {
            // provide access to the dialog controller for view only dialogs
            compositionContext.bindingContext = { controller: dialogController };
        }
        return this.compositionEngine.compose(compositionContext).then(function (controller) {
            dialogController.controller = controller;
            return dialogController.renderer.showDialog(dialogController).then(function () {
                _this.controllers.push(dialogController);
                _this.hasActiveDialog = _this.hasOpenDialog = !!_this.controllers.length;
            }, function (reason) {
                if (controller.viewModel) {
                    invokeLifecycle(controller.viewModel, 'deactivate');
                }
                return Promise.reject(reason);
            });
        });
    };
    /**
     * @internal
     */
    DialogService.prototype.createSettings = function (settings) {
        settings = Object.assign({}, this.defaultSettings, settings);
        if (typeof settings.keyboard !== 'boolean' && !settings.keyboard) {
            settings.keyboard = !settings.lock;
        }
        if (typeof settings.overlayDismiss !== 'boolean') {
            settings.overlayDismiss = !settings.lock;
        }
        Object.defineProperty(settings, 'rejectOnCancel', {
            writable: false,
            configurable: true,
            enumerable: true
        });
        this.validateSettings(settings);
        return settings;
    };
    DialogService.prototype.open = function (settings) {
        var _this = this;
        if (settings === void 0) { settings = {}; }
        // tslint:enable:max-line-length
        settings = this.createSettings(settings);
        var childContainer = settings.childContainer || this.container.createChild();
        var resolveCloseResult;
        var rejectCloseResult;
        var closeResult = new Promise(function (resolve, reject) {
            resolveCloseResult = resolve;
            rejectCloseResult = reject;
        });
        var dialogController = childContainer.invoke(DialogController, [settings, resolveCloseResult, rejectCloseResult]);
        childContainer.registerInstance(DialogController, dialogController);
        closeResult.then(function () {
            removeController(_this, dialogController);
        }, function () {
            removeController(_this, dialogController);
        });
        var compositionContext = this.createCompositionContext(childContainer, dialogController.renderer.getDialogContainer(), dialogController.settings);
        var openResult = this.ensureViewModel(compositionContext).then(function (compositionContext) {
            if (!compositionContext.viewModel) {
                return true;
            }
            return invokeLifecycle(compositionContext.viewModel, 'canActivate', dialogController.settings.model);
        }).then(function (canActivate) {
            if (!canActivate) {
                return _this._cancelOperation(dialogController.settings.rejectOnCancel);
            }
            // if activation granted, compose and show
            return _this.composeAndShowDialog(compositionContext, dialogController)
                .then(function () { return ({ controller: dialogController, closeResult: closeResult, wasCancelled: false }); });
        });
        return asDialogOpenPromise(openResult);
    };
    /**
     * Closes all open dialogs at the time of invocation.
     * @return Promise<DialogController[]> All controllers whose close operation was cancelled.
     */
    DialogService.prototype.closeAll = function () {
        return Promise.all(this.controllers.slice(0).map(function (controller) {
            if (!controller.settings.rejectOnCancel) {
                return controller.cancel().then(function (result) {
                    if (result.wasCancelled) {
                        return controller;
                    }
                    return null;
                });
            }
            return controller.cancel().then(function () { return null; }).catch(function (reason) {
                if (reason.wasCancelled) {
                    return controller;
                }
                throw reason;
            });
        })).then(function (unclosedControllers) { return unclosedControllers.filter(function (unclosed) { return !!unclosed; }); });
    };
    /**
     * @internal
     */
    // tslint:disable-next-line:member-ordering
    DialogService.inject = [Container, CompositionEngine, DefaultDialogSettings];
    return DialogService;
}());
export { DialogService };
function removeController(service, dialogController) {
    var i = service.controllers.indexOf(dialogController);
    if (i !== -1) {
        service.controllers.splice(i, 1);
        service.hasActiveDialog = service.hasOpenDialog = !!service.controllers.length;
    }
}

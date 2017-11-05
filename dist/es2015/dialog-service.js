import { Container } from 'aurelia-dependency-injection';
import { Origin } from 'aurelia-metadata';
import { CompositionEngine, ViewSlot } from 'aurelia-templating';
import { DefaultDialogSettings } from './dialog-settings';
import { createDialogCancelError } from './dialog-cancel-error';
import { invokeLifecycle } from './lifecycle';
import { DialogController } from './dialog-controller';
/* tslint:enable:max-line-length */
function whenClosed(onfulfilled, onrejected) {
    return this.then(r => r.wasCancelled ? r : r.closeResult).then(onfulfilled, onrejected);
}
function asDialogOpenPromise(promise) {
    promise.whenClosed = whenClosed;
    return promise;
}
/**
 * A service allowing for the creation of dialogs.
 */
export class DialogService {
    constructor(container, compositionEngine, defaultSettings) {
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
    validateSettings(settings) {
        if (!settings.viewModel && !settings.view) {
            throw new Error('Invalid Dialog Settings. You must provide "viewModel", "view" or both.');
        }
    }
    // tslint:disable-next-line:max-line-length
    createCompositionContext(childContainer, host, settings) {
        return {
            container: childContainer.parent,
            childContainer,
            bindingContext: null,
            viewResources: null,
            model: settings.model,
            view: settings.view,
            viewModel: settings.viewModel,
            viewSlot: new ViewSlot(host, true),
            host
        };
    }
    ensureViewModel(compositionContext) {
        if (typeof compositionContext.viewModel === 'function') {
            const moduleId = Origin.get(compositionContext.viewModel).moduleId;
            if (!moduleId) {
                return Promise.reject(new Error(`Can not resolve "moduleId" of "${compositionContext.viewModel.name}".`));
            }
            compositionContext.viewModel = moduleId;
        }
        if (typeof compositionContext.viewModel === 'string') {
            return this.compositionEngine.ensureViewModel(compositionContext);
        }
        return Promise.resolve(compositionContext);
    }
    _cancelOperation(rejectOnCancel) {
        if (!rejectOnCancel) {
            return { wasCancelled: true };
        }
        throw createDialogCancelError();
    }
    // tslint:disable-next-line:max-line-length
    composeAndShowDialog(compositionContext, dialogController) {
        if (!compositionContext.viewModel) {
            // provide access to the dialog controller for view only dialogs
            compositionContext.bindingContext = { controller: dialogController };
        }
        return this.compositionEngine.compose(compositionContext).then((controller) => {
            dialogController.controller = controller;
            return dialogController.renderer.showDialog(dialogController).then(() => {
                this.controllers.push(dialogController);
                this.hasActiveDialog = this.hasOpenDialog = !!this.controllers.length;
            }, reason => {
                if (controller.viewModel) {
                    invokeLifecycle(controller.viewModel, 'deactivate');
                }
                return Promise.reject(reason);
            });
        });
    }
    /**
     * @internal
     */
    createSettings(settings) {
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
    }
    open(settings = {}) {
        // tslint:enable:max-line-length
        settings = this.createSettings(settings);
        const childContainer = settings.childContainer || this.container.createChild();
        let resolveCloseResult;
        let rejectCloseResult;
        const closeResult = new Promise((resolve, reject) => {
            resolveCloseResult = resolve;
            rejectCloseResult = reject;
        });
        const dialogController = childContainer.invoke(DialogController, [settings, resolveCloseResult, rejectCloseResult]);
        childContainer.registerInstance(DialogController, dialogController);
        closeResult.then(() => {
            removeController(this, dialogController);
        }, () => {
            removeController(this, dialogController);
        });
        const compositionContext = this.createCompositionContext(childContainer, dialogController.renderer.getDialogContainer(), dialogController.settings);
        const openResult = this.ensureViewModel(compositionContext).then(compositionContext => {
            if (!compositionContext.viewModel) {
                return true;
            }
            return invokeLifecycle(compositionContext.viewModel, 'canActivate', dialogController.settings.model);
        }).then(canActivate => {
            if (!canActivate) {
                return this._cancelOperation(dialogController.settings.rejectOnCancel);
            }
            // if activation granted, compose and show
            return this.composeAndShowDialog(compositionContext, dialogController)
                .then(() => ({ controller: dialogController, closeResult, wasCancelled: false }));
        });
        return asDialogOpenPromise(openResult);
    }
    /**
     * Closes all open dialogs at the time of invocation.
     * @return Promise<DialogController[]> All controllers whose close operation was cancelled.
     */
    closeAll() {
        return Promise.all(this.controllers.slice(0).map(controller => {
            if (!controller.settings.rejectOnCancel) {
                return controller.cancel().then(result => {
                    if (result.wasCancelled) {
                        return controller;
                    }
                    return null;
                });
            }
            return controller.cancel().then(() => null).catch(reason => {
                if (reason.wasCancelled) {
                    return controller;
                }
                throw reason;
            });
        })).then(unclosedControllers => unclosedControllers.filter(unclosed => !!unclosed));
    }
}
/**
 * @internal
 */
// tslint:disable-next-line:member-ordering
DialogService.inject = [Container, CompositionEngine, DefaultDialogSettings];
function removeController(service, dialogController) {
    const i = service.controllers.indexOf(dialogController);
    if (i !== -1) {
        service.controllers.splice(i, 1);
        service.hasActiveDialog = service.hasOpenDialog = !!service.controllers.length;
    }
}

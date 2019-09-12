import { R as Renderer, c as createDialogCancelError, i as invokeLifecycle, D as DialogController } from './dialog-controller.js';
export { D as DialogController, R as Renderer, c as createDialogCancelError } from './dialog-controller.js';
import { DOM } from 'aurelia-pal';
import { Container } from 'aurelia-dependency-injection';
import { ViewSlot, CompositionEngine } from 'aurelia-templating';

class DefaultDialogSettings {
    constructor() {
        this.lock = true;
        this.startingZIndex = 1000;
        this.centerHorizontalOnly = false;
        this.rejectOnCancel = false;
        this.ignoreTransitions = false;
    }
}

const RENDERRERS = {
    ux: () => import('./ux-dialog-renderer.js').then(m => m.DialogRenderer),
    native: () => import('./native-dialog-renderer.js').then(m => m.NativeDialogRenderer)
};
const DEFAULT_RESOURCES = {
    'ux-dialog': () => import('./ux-dialog.js').then(m => m.UxDialog),
    'ux-dialog-header': () => import('./ux-dialog-header.js').then(m => m.UxDialogHeader),
    'ux-dialog-body': () => import('./ux-dialog-body.js').then(m => m.UxDialogBody),
    'ux-dialog-footer': () => import('./ux-dialog-footer.js').then(m => m.UxDialogFooter),
    'attach-focus': () => import('./attach-focus.js').then(m => m.AttachFocus)
};
const DEFAULT_CSS_TEXT = () => import('./default-styles.js').then(cssM => cssM['default']);
class DialogConfiguration {
    constructor(frameworkConfiguration, applySetter) {
        this.renderer = 'ux';
        this.cssText = DEFAULT_CSS_TEXT;
        this.resources = [];
        this.fwConfig = frameworkConfiguration;
        this.settings = frameworkConfiguration.container.get(DefaultDialogSettings);
        applySetter(() => this._apply());
    }
    _apply() {
        const renderer = this.renderer;
        const cssText = this.cssText;
        return Promise
            .all([
            typeof renderer === 'string' ? RENDERRERS[renderer]() : renderer,
            cssText
                ? typeof cssText === 'string'
                    ? cssText
                    : cssText()
                : ''
        ])
            .then(([rendererImpl, $cssText]) => {
            const fwConfig = this.fwConfig;
            fwConfig.transient(Renderer, rendererImpl);
            if ($cssText) {
                DOM.injectStyles($cssText);
            }
            return Promise
                .all(this.resources.map(name => DEFAULT_RESOURCES[name]()))
                .then(modules => {
                fwConfig.globalResources(modules);
            });
        });
    }
    useDefaults() {
        return this
            .useRenderer('ux')
            .useCSS(DEFAULT_CSS_TEXT)
            .useStandardResources();
    }
    useStandardResources() {
        Object.keys(DEFAULT_RESOURCES).forEach(this.useResource, this);
        return this;
    }
    useResource(resourceName) {
        this.resources.push(resourceName);
        return this;
    }
    useRenderer(renderer, settings) {
        this.renderer = renderer;
        if (settings) {
            Object.assign(this.settings, settings);
        }
        return this;
    }
    useCSS(cssText) {
        this.cssText = cssText;
        return this;
    }
}

function whenClosed(onfulfilled, onrejected) {
    return this.then(r => r.wasCancelled ? r : r.closeResult).then(onfulfilled, onrejected);
}
function asDialogOpenPromise(promise) {
    promise.whenClosed = whenClosed;
    return promise;
}
class DialogService {
    constructor(container, compositionEngine, defaultSettings) {
        this.controllers = [];
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
        if (typeof compositionContext.viewModel === 'object') {
            return Promise.resolve(compositionContext);
        }
        return this.compositionEngine.ensureViewModel(compositionContext);
    }
    _cancelOperation(rejectOnCancel) {
        if (!rejectOnCancel) {
            return { wasCancelled: true };
        }
        throw createDialogCancelError();
    }
    composeAndShowDialog(compositionContext, dialogController) {
        if (!compositionContext.viewModel) {
            compositionContext.bindingContext = { controller: dialogController };
        }
        return this.compositionEngine
            .compose(compositionContext)
            .then((controller) => {
            dialogController.controller = controller;
            return dialogController.renderer
                .showDialog(dialogController)
                .then(() => {
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
            return this.composeAndShowDialog(compositionContext, dialogController)
                .then(() => ({ controller: dialogController, closeResult, wasCancelled: false }));
        });
        return asDialogOpenPromise(openResult);
    }
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
DialogService.inject = [Container, CompositionEngine, DefaultDialogSettings];
function removeController(service, dialogController) {
    const i = service.controllers.indexOf(dialogController);
    if (i !== -1) {
        service.controllers.splice(i, 1);
        service.hasActiveDialog = service.hasOpenDialog = !!service.controllers.length;
    }
}

function configure(frameworkConfig, callback) {
    let applyConfig = null;
    const config = new DialogConfiguration(frameworkConfig, (apply) => { applyConfig = apply; });
    if (typeof callback === 'function') {
        callback(config);
    }
    else {
        config.useDefaults();
    }
    return applyConfig();
}

export { DefaultDialogSettings, DialogConfiguration, DialogService, configure };
//# sourceMappingURL=aurelia-dialog.js.map

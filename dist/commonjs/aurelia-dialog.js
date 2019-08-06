'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var __chunk_1 = require('./chunk.js');
var aureliaPal = require('aurelia-pal');
var aureliaDependencyInjection = require('aurelia-dependency-injection');
var aureliaTemplating = require('aurelia-templating');

var DefaultDialogSettings = (function () {
    function DefaultDialogSettings() {
        this.lock = true;
        this.startingZIndex = 1000;
        this.centerHorizontalOnly = false;
        this.rejectOnCancel = false;
        this.ignoreTransitions = false;
    }
    return DefaultDialogSettings;
}());

var RENDERRERS = {
    ux: function () { return Promise.resolve(require('./ux-dialog-renderer.js')).then(function (m) { return m.DialogRenderer; }); },
    native: function () { return Promise.resolve(require('./native-dialog-renderer.js')).then(function (m) { return m.NativeDialogRenderer; }); }
};
var DEFAULT_RESOURCES = {
    'ux-dialog': function () { return Promise.resolve(require('./ux-dialog.js')).then(function (m) { return m.UxDialog; }); },
    'ux-dialog-header': function () { return Promise.resolve(require('./ux-dialog-header.js')).then(function (m) { return m.UxDialogHeader; }); },
    'ux-dialog-body': function () { return Promise.resolve(require('./ux-dialog-body.js')).then(function (m) { return m.UxDialogBody; }); },
    'ux-dialog-footer': function () { return Promise.resolve(require('./ux-dialog-footer.js')).then(function (m) { return m.UxDialogFooter; }); },
    'attach-focus': function () { return Promise.resolve(require('./attach-focus.js')).then(function (m) { return m.AttachFocus; }); }
};
var DEFAULT_CSS_TEXT = function () { return Promise.resolve(require('./default-styles.js')).then(function (cssM) { return cssM['default']; }); };
var DialogConfiguration = (function () {
    function DialogConfiguration(frameworkConfiguration, applySetter) {
        var _this = this;
        this.renderer = 'ux';
        this.cssText = DEFAULT_CSS_TEXT;
        this.resources = [];
        this.fwConfig = frameworkConfiguration;
        this.settings = frameworkConfiguration.container.get(DefaultDialogSettings);
        applySetter(function () { return _this._apply(); });
    }
    DialogConfiguration.prototype._apply = function () {
        var _this = this;
        var renderer = this.renderer;
        var cssText = this.cssText;
        return Promise
            .all([
            typeof renderer === 'string' ? RENDERRERS[renderer]() : renderer,
            cssText
                ? typeof cssText === 'string'
                    ? cssText
                    : cssText()
                : ''
        ])
            .then(function (_a) {
            var rendererImpl = _a[0], $cssText = _a[1];
            var fwConfig = _this.fwConfig;
            fwConfig.transient(__chunk_1.Renderer, rendererImpl);
            if ($cssText) {
                aureliaPal.DOM.injectStyles($cssText);
            }
            return Promise
                .all(_this.resources.map(function (name) { return DEFAULT_RESOURCES[name](); }))
                .then(function (modules) {
                fwConfig.globalResources(modules);
            });
        });
    };
    DialogConfiguration.prototype.useDefaults = function () {
        return this
            .useRenderer('ux')
            .useCSS(DEFAULT_CSS_TEXT)
            .useStandardResources();
    };
    DialogConfiguration.prototype.useStandardResources = function () {
        Object.keys(DEFAULT_RESOURCES).forEach(this.useResource, this);
        return this;
    };
    DialogConfiguration.prototype.useResource = function (resourceName) {
        this.resources.push(resourceName);
        return this;
    };
    DialogConfiguration.prototype.useRenderer = function (renderer, settings) {
        this.renderer = renderer;
        if (settings) {
            Object.assign(this.settings, settings);
        }
        return this;
    };
    DialogConfiguration.prototype.useCSS = function (cssText) {
        this.cssText = cssText;
        return this;
    };
    return DialogConfiguration;
}());

function whenClosed(onfulfilled, onrejected) {
    return this.then(function (r) { return r.wasCancelled ? r : r.closeResult; }).then(onfulfilled, onrejected);
}
function asDialogOpenPromise(promise) {
    promise.whenClosed = whenClosed;
    return promise;
}
var DialogService = (function () {
    function DialogService(container, compositionEngine, defaultSettings) {
        this.controllers = [];
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
    DialogService.prototype.createCompositionContext = function (childContainer, host, settings) {
        return {
            container: childContainer.parent,
            childContainer: childContainer,
            bindingContext: null,
            viewResources: null,
            model: settings.model,
            view: settings.view,
            viewModel: settings.viewModel,
            viewSlot: new aureliaTemplating.ViewSlot(host, true),
            host: host
        };
    };
    DialogService.prototype.ensureViewModel = function (compositionContext) {
        if (typeof compositionContext.viewModel === 'object') {
            return Promise.resolve(compositionContext);
        }
        return this.compositionEngine.ensureViewModel(compositionContext);
    };
    DialogService.prototype._cancelOperation = function (rejectOnCancel) {
        if (!rejectOnCancel) {
            return { wasCancelled: true };
        }
        throw __chunk_1.createDialogCancelError();
    };
    DialogService.prototype.composeAndShowDialog = function (compositionContext, dialogController) {
        var _this = this;
        if (!compositionContext.viewModel) {
            compositionContext.bindingContext = { controller: dialogController };
        }
        return this.compositionEngine
            .compose(compositionContext)
            .then(function (controller) {
            dialogController.controller = controller;
            return dialogController.renderer
                .showDialog(dialogController)
                .then(function () {
                _this.controllers.push(dialogController);
                _this.hasActiveDialog = _this.hasOpenDialog = !!_this.controllers.length;
            }, function (reason) {
                if (controller.viewModel) {
                    __chunk_1.invokeLifecycle(controller.viewModel, 'deactivate');
                }
                return Promise.reject(reason);
            });
        });
    };
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
        settings = this.createSettings(settings);
        var childContainer = settings.childContainer || this.container.createChild();
        var resolveCloseResult;
        var rejectCloseResult;
        var closeResult = new Promise(function (resolve, reject) {
            resolveCloseResult = resolve;
            rejectCloseResult = reject;
        });
        var dialogController = childContainer.invoke(__chunk_1.DialogController, [settings, resolveCloseResult, rejectCloseResult]);
        childContainer.registerInstance(__chunk_1.DialogController, dialogController);
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
            return __chunk_1.invokeLifecycle(compositionContext.viewModel, 'canActivate', dialogController.settings.model);
        }).then(function (canActivate) {
            if (!canActivate) {
                return _this._cancelOperation(dialogController.settings.rejectOnCancel);
            }
            return _this.composeAndShowDialog(compositionContext, dialogController)
                .then(function () { return ({ controller: dialogController, closeResult: closeResult, wasCancelled: false }); });
        });
        return asDialogOpenPromise(openResult);
    };
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
    DialogService.inject = [aureliaDependencyInjection.Container, aureliaTemplating.CompositionEngine, DefaultDialogSettings];
    return DialogService;
}());
function removeController(service, dialogController) {
    var i = service.controllers.indexOf(dialogController);
    if (i !== -1) {
        service.controllers.splice(i, 1);
        service.hasActiveDialog = service.hasOpenDialog = !!service.controllers.length;
    }
}

function configure(frameworkConfig, callback) {
    var applyConfig = null;
    var config = new DialogConfiguration(frameworkConfig, function (apply) { applyConfig = apply; });
    if (typeof callback === 'function') {
        callback(config);
    }
    else {
        config.useDefaults();
    }
    return applyConfig();
}

exports.DialogController = __chunk_1.DialogController;
exports.Renderer = __chunk_1.Renderer;
exports.createDialogCancelError = __chunk_1.createDialogCancelError;
exports.DefaultDialogSettings = DefaultDialogSettings;
exports.DialogConfiguration = DialogConfiguration;
exports.DialogService = DialogService;
exports.configure = configure;
//# sourceMappingURL=aurelia-dialog.js.map

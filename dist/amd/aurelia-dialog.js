define(['require', 'exports', './dialog-controller', 'aurelia-pal', 'aurelia-dependency-injection', 'aurelia-templating'], function (require, exports, dialogController, aureliaPal, aureliaDependencyInjection, aureliaTemplating) { 'use strict';

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
      ux: function () { return new Promise(function (resolve, reject) { require(['./ux-dialog-renderer'], resolve, reject) }).then(function (m) { return m.DialogRenderer; }); },
      native: function () { return new Promise(function (resolve, reject) { require(['./native-dialog-renderer'], resolve, reject) }).then(function (m) { return m.NativeDialogRenderer; }); }
  };
  var DEFAULT_RESOURCES = {
      'ux-dialog': function () { return new Promise(function (resolve, reject) { require(['./ux-dialog'], resolve, reject) }).then(function (m) { return m.UxDialog; }); },
      'ux-dialog-header': function () { return new Promise(function (resolve, reject) { require(['./ux-dialog-header'], resolve, reject) }).then(function (m) { return m.UxDialogHeader; }); },
      'ux-dialog-body': function () { return new Promise(function (resolve, reject) { require(['./ux-dialog-body'], resolve, reject) }).then(function (m) { return m.UxDialogBody; }); },
      'ux-dialog-footer': function () { return new Promise(function (resolve, reject) { require(['./ux-dialog-footer'], resolve, reject) }).then(function (m) { return m.UxDialogFooter; }); },
      'attach-focus': function () { return new Promise(function (resolve, reject) { require(['./attach-focus'], resolve, reject) }).then(function (m) { return m.AttachFocus; }); }
  };
  var DEFAULT_CSS_TEXT = function () { return new Promise(function (resolve, reject) { require(['./default-styles'], resolve, reject) }).then(function (cssM) { return cssM['default']; }); };
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
              fwConfig.transient(dialogController.Renderer, rendererImpl);
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
          throw dialogController.createDialogCancelError();
      };
      DialogService.prototype.composeAndShowDialog = function (compositionContext, dialogController$1) {
          var _this = this;
          if (!compositionContext.viewModel) {
              compositionContext.bindingContext = { controller: dialogController$1 };
          }
          return this.compositionEngine
              .compose(compositionContext)
              .then(function (controller) {
              dialogController$1.controller = controller;
              return dialogController$1.renderer
                  .showDialog(dialogController$1)
                  .then(function () {
                  _this.controllers.push(dialogController$1);
                  _this.hasActiveDialog = _this.hasOpenDialog = !!_this.controllers.length;
              }, function (reason) {
                  if (controller.viewModel) {
                      dialogController.invokeLifecycle(controller.viewModel, 'deactivate');
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
          var dialogController$1 = childContainer.invoke(dialogController.DialogController, [settings, resolveCloseResult, rejectCloseResult]);
          childContainer.registerInstance(dialogController.DialogController, dialogController$1);
          closeResult.then(function () {
              removeController(_this, dialogController$1);
          }, function () {
              removeController(_this, dialogController$1);
          });
          var compositionContext = this.createCompositionContext(childContainer, dialogController$1.renderer.getDialogContainer(), dialogController$1.settings);
          var openResult = this.ensureViewModel(compositionContext).then(function (compositionContext) {
              if (!compositionContext.viewModel) {
                  return true;
              }
              return dialogController.invokeLifecycle(compositionContext.viewModel, 'canActivate', dialogController$1.settings.model);
          }).then(function (canActivate) {
              if (!canActivate) {
                  return _this._cancelOperation(dialogController$1.settings.rejectOnCancel);
              }
              return _this.composeAndShowDialog(compositionContext, dialogController$1)
                  .then(function () { return ({ controller: dialogController$1, closeResult: closeResult, wasCancelled: false }); });
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

  exports.DialogController = dialogController.DialogController;
  exports.Renderer = dialogController.Renderer;
  exports.createDialogCancelError = dialogController.createDialogCancelError;
  exports.DefaultDialogSettings = DefaultDialogSettings;
  exports.DialogConfiguration = DialogConfiguration;
  exports.DialogService = DialogService;
  exports.configure = configure;

  Object.defineProperty(exports, '__esModule', { value: true });

});
//# sourceMappingURL=aurelia-dialog.js.map

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('aurelia-pal'), require('aurelia-dependency-injection'), require('aurelia-templating')) :
  typeof define === 'function' && define.amd ? define(['exports', 'aurelia-pal', 'aurelia-dependency-injection', 'aurelia-templating'], factory) :
  (global = global || self, factory((global.au = global.au || {}, global.au.dialog = {}), global.au, global.au, global.au));
}(this, function (exports, aureliaPal, aureliaDependencyInjection, aureliaTemplating) { 'use strict';

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

  class DefaultDialogSettings {
      constructor() {
          this.lock = true;
          this.startingZIndex = 1000;
          this.centerHorizontalOnly = false;
          this.rejectOnCancel = false;
          this.ignoreTransitions = false;
      }
  }

  const containerTagName = 'ux-dialog-container';
  const overlayTagName = 'ux-dialog-overlay';
  const transitionEvent = (() => {
      let transition;
      return () => {
          if (transition) {
              return transition;
          }
          const el = aureliaPal.DOM.createElement('fakeelement');
          const transitions = {
              transition: 'transitionend',
              OTransition: 'oTransitionEnd',
              MozTransition: 'transitionend',
              WebkitTransition: 'webkitTransitionEnd'
          };
          for (let t in transitions) {
              if (el.style[t] !== undefined) {
                  transition = transitions[t];
                  return transition;
              }
          }
          return '';
      };
  })();
  const hasTransition = (() => {
      const unprefixedName = 'transitionDuration';
      const prefixedNames = ['webkitTransitionDuration', 'oTransitionDuration'];
      let el;
      let transitionDurationName;
      return (element) => {
          if (!el) {
              el = aureliaPal.DOM.createElement('fakeelement');
              if (unprefixedName in el.style) {
                  transitionDurationName = unprefixedName;
              }
              else {
                  transitionDurationName = prefixedNames.find(prefixed => (prefixed in el.style));
              }
          }
          return !!transitionDurationName && !!(aureliaPal.DOM.getComputedStyle(element)[transitionDurationName]
              .split(',')
              .find((duration) => !!parseFloat(duration)));
      };
  })();
  let body;
  function getActionKey(e) {
      if ((e.code || e.key) === 'Escape' || e.keyCode === 27) {
          return 'Escape';
      }
      if ((e.code || e.key) === 'Enter' || e.keyCode === 13) {
          return 'Enter';
      }
      return undefined;
  }
  class DialogRenderer {
      static keyboardEventHandler(e) {
          const key = getActionKey(e);
          if (!key) {
              return;
          }
          const top = DialogRenderer.dialogControllers[DialogRenderer.dialogControllers.length - 1];
          if (!top || !top.settings.keyboard) {
              return;
          }
          const keyboard = top.settings.keyboard;
          if (key === 'Escape'
              && (keyboard === true || keyboard === key || (Array.isArray(keyboard) && keyboard.indexOf(key) > -1))) {
              top.cancel();
          }
          else if (key === 'Enter' && (keyboard === key || (Array.isArray(keyboard) && keyboard.indexOf(key) > -1))) {
              top.ok();
          }
      }
      static trackController(dialogController) {
          if (!DialogRenderer.dialogControllers.length) {
              aureliaPal.DOM.addEventListener(dialogController.settings.keyEvent || 'keyup', DialogRenderer.keyboardEventHandler, false);
          }
          DialogRenderer.dialogControllers.push(dialogController);
      }
      static untrackController(dialogController) {
          const i = DialogRenderer.dialogControllers.indexOf(dialogController);
          if (i !== -1) {
              DialogRenderer.dialogControllers.splice(i, 1);
          }
          if (!DialogRenderer.dialogControllers.length) {
              aureliaPal.DOM.removeEventListener(dialogController.settings.keyEvent || 'keyup', DialogRenderer.keyboardEventHandler, false);
          }
      }
      getOwnElements(parent, selector) {
          const elements = parent.querySelectorAll(selector);
          const own = [];
          for (let i = 0; i < elements.length; i++) {
              if (elements[i].parentElement === parent) {
                  own.push(elements[i]);
              }
          }
          return own;
      }
      attach(dialogController) {
          const spacingWrapper = aureliaPal.DOM.createElement('div');
          spacingWrapper.appendChild(this.anchor);
          this.dialogContainer = aureliaPal.DOM.createElement(containerTagName);
          this.dialogContainer.appendChild(spacingWrapper);
          this.dialogOverlay = aureliaPal.DOM.createElement(overlayTagName);
          const zIndex = typeof dialogController.settings.startingZIndex === 'number'
              ? dialogController.settings.startingZIndex + ''
              : null;
          this.dialogOverlay.style.zIndex = zIndex;
          this.dialogContainer.style.zIndex = zIndex;
          const lastContainer = this.getOwnElements(this.host, containerTagName).pop();
          if (lastContainer && lastContainer.parentElement) {
              this.host.insertBefore(this.dialogContainer, lastContainer.nextSibling);
              this.host.insertBefore(this.dialogOverlay, lastContainer.nextSibling);
          }
          else {
              this.host.insertBefore(this.dialogContainer, this.host.firstChild);
              this.host.insertBefore(this.dialogOverlay, this.host.firstChild);
          }
          dialogController.controller.attached();
          this.host.classList.add('ux-dialog-open');
      }
      detach(dialogController) {
          this.host.removeChild(this.dialogOverlay);
          this.host.removeChild(this.dialogContainer);
          dialogController.controller.detached();
          if (!DialogRenderer.dialogControllers.length) {
              this.host.classList.remove('ux-dialog-open');
          }
      }
      setAsActive() {
          this.dialogOverlay.classList.add('active');
          this.dialogContainer.classList.add('active');
      }
      setAsInactive() {
          this.dialogOverlay.classList.remove('active');
          this.dialogContainer.classList.remove('active');
      }
      setupClickHandling(dialogController) {
          this.stopPropagation = e => { e._aureliaDialogHostClicked = true; };
          this.closeDialogClick = e => {
              if (dialogController.settings.overlayDismiss && !e._aureliaDialogHostClicked) {
                  dialogController.cancel();
              }
          };
          this.dialogContainer.addEventListener('click', this.closeDialogClick);
          this.anchor.addEventListener('click', this.stopPropagation);
      }
      clearClickHandling() {
          this.dialogContainer.removeEventListener('click', this.closeDialogClick);
          this.anchor.removeEventListener('click', this.stopPropagation);
      }
      centerDialog() {
          const child = this.dialogContainer.children[0];
          const vh = Math.max(aureliaPal.DOM.querySelectorAll('html')[0].clientHeight, window.innerHeight || 0);
          child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
          child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
      }
      awaitTransition(setActiveInactive, ignore) {
          return new Promise(resolve => {
              const renderer = this;
              const eventName = transitionEvent();
              function onTransitionEnd(e) {
                  if (e.target !== renderer.dialogContainer) {
                      return;
                  }
                  renderer.dialogContainer.removeEventListener(eventName, onTransitionEnd);
                  resolve();
              }
              if (ignore || !hasTransition(this.dialogContainer)) {
                  resolve();
              }
              else {
                  this.dialogContainer.addEventListener(eventName, onTransitionEnd);
              }
              setActiveInactive();
          });
      }
      getDialogContainer() {
          return this.anchor || (this.anchor = aureliaPal.DOM.createElement('div'));
      }
      showDialog(dialogController) {
          if (!body) {
              body = aureliaPal.DOM.querySelectorAll('body')[0];
          }
          if (dialogController.settings.host) {
              this.host = dialogController.settings.host;
          }
          else {
              this.host = body;
          }
          const settings = dialogController.settings;
          this.attach(dialogController);
          if (typeof settings.position === 'function') {
              settings.position(this.dialogContainer, this.dialogOverlay);
          }
          else if (!settings.centerHorizontalOnly) {
              this.centerDialog();
          }
          DialogRenderer.trackController(dialogController);
          this.setupClickHandling(dialogController);
          return this.awaitTransition(() => this.setAsActive(), dialogController.settings.ignoreTransitions);
      }
      hideDialog(dialogController) {
          this.clearClickHandling();
          DialogRenderer.untrackController(dialogController);
          return this.awaitTransition(() => this.setAsInactive(), dialogController.settings.ignoreTransitions)
              .then(() => { this.detach(dialogController); });
      }
  }
  DialogRenderer.dialogControllers = [];
  aureliaDependencyInjection.transient()(DialogRenderer);

  const defaultRenderer = DialogRenderer;
  const resources = {
      'ux-dialog': () => Promise.resolve().then(function () { return uxDialog; }).then(m => m.UxDialog),
      'ux-dialog-header': () => Promise.resolve().then(function () { return uxDialogHeader; }).then(m => m.UxDialogHeader),
      'ux-dialog-body': () => Promise.resolve().then(function () { return uxDialogBody; }).then(m => m.UxDialogBody),
      'ux-dialog-footer': () => Promise.resolve().then(function () { return uxDialogFooter; }).then(m => m.UxDialogFooter),
      'attach-focus': () => Promise.resolve().then(function () { return attachFocus; }).then(m => m.AttachFocus)
  };
  const defaultCSSText = `ux-dialog-container,ux-dialog-overlay{position:fixed;top:0;right:0;bottom:0;left:0}ux-dialog-overlay{opacity:0}ux-dialog-overlay.active{opacity:1}ux-dialog-container{display:block;transition:opacity .2s linear;opacity:0;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch}ux-dialog-container.active{opacity:1}ux-dialog-container>div{padding:30px}ux-dialog-container>div>div{display:block;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto}ux-dialog-container,ux-dialog-container>div,ux-dialog-container>div>div{outline:0}ux-dialog{display:table;box-shadow:0 5px 15px rgba(0,0,0,.5);border:1px solid rgba(0,0,0,.2);border-radius:5px;padding:3px;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial;background:#fff}ux-dialog>ux-dialog-header{display:block;padding:16px;border-bottom:1px solid #e5e5e5}ux-dialog>ux-dialog-header>button{float:right;border:none;display:block;width:32px;height:32px;background:0 0;font-size:22px;line-height:16px;margin:-14px -16px 0 0;padding:0;cursor:pointer}ux-dialog>ux-dialog-body{display:block;padding:16px}ux-dialog>ux-dialog-footer{display:block;padding:6px;border-top:1px solid #e5e5e5;text-align:right}ux-dialog>ux-dialog-footer button{color:#333;background-color:#fff;padding:6px 12px;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;background-image:none;border:1px solid #ccc;border-radius:4px;margin:5px 0 5px 5px}ux-dialog>ux-dialog-footer button:disabled{cursor:default;opacity:.45}ux-dialog>ux-dialog-footer button:hover:enabled{color:#333;background-color:#e6e6e6;border-color:#adadad}.ux-dialog-open{overflow:hidden}`;
  class DialogConfiguration {
      constructor(frameworkConfiguration, applySetter) {
          this.renderer = defaultRenderer;
          this.cssText = defaultCSSText;
          this.resources = [];
          this.fwConfig = frameworkConfiguration;
          this.settings = this.fwConfig.container.get(DefaultDialogSettings);
          applySetter(() => this._apply());
      }
      _apply() {
          this.fwConfig.transient(Renderer, this.renderer);
          if (this.cssText) {
              aureliaPal.DOM.injectStyles(this.cssText);
          }
          if (this.resources.length) {
              return Promise.all(this.resources.map(name => resources[name]()))
                  .then(modules => { this.fwConfig.globalResources(modules); });
          }
      }
      useDefaults() {
          return this.useRenderer(defaultRenderer)
              .useCSS(defaultCSSText)
              .useStandardResources();
      }
      useStandardResources() {
          return this.useResource('ux-dialog')
              .useResource('ux-dialog-header')
              .useResource('ux-dialog-body')
              .useResource('ux-dialog-footer')
              .useResource('attach-focus');
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

  function createDialogCancelError(output) {
      const error = new Error('Operation cancelled.');
      error.wasCancelled = true;
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

  function createDialogCloseError(output) {
      const error = new Error();
      error.wasCancelled = false;
      error.output = output;
      return error;
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
              .then(() => { this.controller.unbind(); });
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
              viewSlot: new aureliaTemplating.ViewSlot(host, true),
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
  DialogService.inject = [aureliaDependencyInjection.Container, aureliaTemplating.CompositionEngine, DefaultDialogSettings];
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

  class UxDialog {
  }
  UxDialog.$view = `<template><slot></slot></template>`;
  UxDialog.$resource = 'ux-dialog';

  var uxDialog = /*#__PURE__*/Object.freeze({
    UxDialog: UxDialog
  });

  class UxDialogHeader {
      constructor(controller) {
          this.controller = controller;
      }
      bind() {
          if (typeof this.showCloseButton !== 'boolean') {
              this.showCloseButton = !this.controller.settings.lock;
          }
      }
  }
  UxDialogHeader.inject = [DialogController];
  UxDialogHeader.$view = `<template>
    <button
      type="button"
      class="dialog-close"
      aria-label="Close"
      if.bind="showCloseButton"
      click.trigger="controller.cancel()">
      <span aria-hidden="true">&times;</span>
    </button>

    <div class="dialog-header-content">
      <slot></slot>
    </div>
  </template>`;
  UxDialogHeader.$resource = {
      name: 'ux-dialog-header',
      bindables: ['showCloseButton']
  };

  var uxDialogHeader = /*#__PURE__*/Object.freeze({
    UxDialogHeader: UxDialogHeader
  });

  class UxDialogBody {
  }
  UxDialogBody.$view = `<template><slot></slot></template>`;
  UxDialogBody.$resource = 'ux-dialog-body';

  var uxDialogBody = /*#__PURE__*/Object.freeze({
    UxDialogBody: UxDialogBody
  });

  class UxDialogFooter {
      constructor(controller) {
          this.controller = controller;
          this.buttons = [];
          this.useDefaultButtons = false;
      }
      static isCancelButton(value) {
          return value === 'Cancel';
      }
      close(buttonValue) {
          if (UxDialogFooter.isCancelButton(buttonValue)) {
              this.controller.cancel(buttonValue);
          }
          else {
              this.controller.ok(buttonValue);
          }
      }
      useDefaultButtonsChanged(newValue) {
          if (newValue) {
              this.buttons = ['Cancel', 'Ok'];
          }
      }
  }
  UxDialogFooter.inject = [DialogController];
  UxDialogFooter.$view = `<template>
    <slot></slot>
    <template if.bind="buttons.length > 0">
      <button type="button"
        class="btn btn-default"
        repeat.for="button of buttons"
        click.trigger="close(button)">
        \${button}
      </button>
    </template>
  </template>`;
  UxDialogFooter.$resource = {
      name: 'ux-dialog-footer',
      bindables: ['buttons', 'useDefaultButtons']
  };

  var uxDialogFooter = /*#__PURE__*/Object.freeze({
    UxDialogFooter: UxDialogFooter
  });

  class AttachFocus {
      constructor(element) {
          this.element = element;
          this.value = true;
      }
      static inject() {
          return [aureliaPal.DOM.Element];
      }
      attached() {
          if (this.value === '' || (this.value && this.value !== 'false')) {
              this.element.focus();
          }
      }
  }
  AttachFocus.$resource = {
      type: 'attribute',
      name: 'attach-focus'
  };

  var attachFocus = /*#__PURE__*/Object.freeze({
    AttachFocus: AttachFocus
  });

  exports.configure = configure;
  exports.DefaultDialogSettings = DefaultDialogSettings;
  exports.DialogConfiguration = DialogConfiguration;
  exports.Renderer = Renderer;
  exports.createDialogCancelError = createDialogCancelError;
  exports.DialogService = DialogService;
  exports.DialogController = DialogController;

}));

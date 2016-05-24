'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DialogConfiguration = exports.DialogService = exports.DialogRenderer = exports.Renderer = exports.DialogResult = exports.DialogController = exports.AttachFocus = exports.AiDialog = exports.AiDialogHeader = exports.AiDialogFooter = exports.AiDialogBody = exports.dialogOptions = undefined;

var _dec, _class, _dec2, _class2, _desc, _value, _class3, _descriptor, _descriptor2, _class4, _temp, _dec3, _class5, _class6, _temp2, _dec4, _class7, _dec5, _class8, _class9, _temp3, _dec6, _class12, _class14, _temp4;

exports.invokeLifecycle = invokeLifecycle;

var _aureliaTemplating = require('aurelia-templating');

var _aureliaPal = require('aurelia-pal');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaMetadata = require('aurelia-metadata');

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dialogOptions = exports.dialogOptions = {
  lock: true,
  centerHorizontalOnly: false,
  startingZIndex: 1000
};

var AiDialogBody = exports.AiDialogBody = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-body'), _dec(_class = function AiDialogBody() {
  _classCallCheck(this, AiDialogBody);
}) || _class);
var AiDialogFooter = exports.AiDialogFooter = (_dec2 = (0, _aureliaTemplating.customElement)('ai-dialog-footer'), _dec2(_class2 = (_class3 = (_temp = _class4 = function () {
  function AiDialogFooter(controller) {
    _classCallCheck(this, AiDialogFooter);

    _initDefineProp(this, 'buttons', _descriptor, this);

    _initDefineProp(this, 'useDefaultButtons', _descriptor2, this);

    this.controller = controller;
  }

  AiDialogFooter.prototype.close = function close(buttonValue) {
    if (AiDialogFooter.isCancelButton(buttonValue)) {
      this.controller.cancel(buttonValue);
    } else {
      this.controller.ok(buttonValue);
    }
  };

  AiDialogFooter.prototype.useDefaultButtonsChanged = function useDefaultButtonsChanged(newValue) {
    if (newValue) {
      this.buttons = ['Cancel', 'Ok'];
    }
  };

  AiDialogFooter.isCancelButton = function isCancelButton(value) {
    return value === 'Cancel';
  };

  return AiDialogFooter;
}(), _class4.inject = [DialogController], _temp), (_descriptor = _applyDecoratedDescriptor(_class3.prototype, 'buttons', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class3.prototype, 'useDefaultButtons', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
})), _class3)) || _class2);
var AiDialogHeader = exports.AiDialogHeader = (_dec3 = (0, _aureliaTemplating.customElement)('ai-dialog-header'), _dec3(_class5 = (_temp2 = _class6 = function AiDialogHeader(controller) {
  _classCallCheck(this, AiDialogHeader);

  this.controller = controller;
}, _class6.inject = [DialogController], _temp2)) || _class5);
var AiDialog = exports.AiDialog = (_dec4 = (0, _aureliaTemplating.customElement)('ai-dialog'), _dec4(_class7 = function AiDialog() {
  _classCallCheck(this, AiDialog);
}) || _class7);
var AttachFocus = exports.AttachFocus = (_dec5 = (0, _aureliaTemplating.customAttribute)('attach-focus'), _dec5(_class8 = (_temp3 = _class9 = function () {
  function AttachFocus(element) {
    _classCallCheck(this, AttachFocus);

    this.value = true;

    this.element = element;
  }

  AttachFocus.prototype.attached = function attached() {
    if (this.value && this.value !== 'false') {
      this.element.focus();
    }
  };

  AttachFocus.prototype.valueChanged = function valueChanged(newValue) {
    this.value = newValue;
  };

  return AttachFocus;
}(), _class9.inject = [Element], _temp3)) || _class8);
function invokeLifecycle(instance, name, model) {
  if (typeof instance[name] === 'function') {
    var result = instance[name](model);

    if (result instanceof Promise) {
      return result;
    }

    if (result !== null && result !== undefined) {
      return Promise.resolve(result);
    }

    return Promise.resolve(true);
  }

  return Promise.resolve(true);
}

var DialogController = exports.DialogController = function () {
  function DialogController(renderer, settings, resolve, reject) {
    _classCallCheck(this, DialogController);

    this._renderer = renderer;
    this.settings = Object.assign({}, this._renderer.defaultSettings, settings);
    this._resolve = resolve;
    this._reject = reject;
  }

  DialogController.prototype.ok = function ok(result) {
    this.close(true, result);
  };

  DialogController.prototype.cancel = function cancel(result) {
    this.close(false, result);
  };

  DialogController.prototype.error = function error(message) {
    var _this = this;

    return invokeLifecycle(this.viewModel, 'deactivate').then(function () {
      return _this._renderer.hideDialog(_this);
    }).then(function () {
      _this.controller.unbind();
      _this._reject(message);
    });
  };

  DialogController.prototype.close = function close(ok, result) {
    var _this2 = this;

    var returnResult = new DialogResult(!ok, result);
    return invokeLifecycle(this.viewModel, 'canDeactivate').then(function (canDeactivate) {
      if (canDeactivate) {
        return invokeLifecycle(_this2.viewModel, 'deactivate').then(function () {
          return _this2._renderer.hideDialog(_this2);
        }).then(function () {
          _this2.controller.unbind();
          _this2._resolve(returnResult);
        });
      }
    });
  };

  return DialogController;
}();

var DialogResult = exports.DialogResult = function DialogResult(cancelled, result) {
  _classCallCheck(this, DialogResult);

  this.wasCancelled = false;

  this.wasCancelled = cancelled;
  this.output = result;
};

var Renderer = exports.Renderer = function () {
  function Renderer() {
    _classCallCheck(this, Renderer);
  }

  Renderer.prototype.getDialogContainer = function getDialogContainer() {
    throw new Error('DialogRenderer must implement getDialogContainer().');
  };

  Renderer.prototype.showDialog = function showDialog(dialogController) {
    throw new Error('DialogRenderer must implement showDialog().');
  };

  Renderer.prototype.hideDialog = function hideDialog(dialogController) {
    throw new Error('DialogRenderer must implement hideDialog().');
  };

  return Renderer;
}();

var containerTagName = 'ai-dialog-container';
var overlayTagName = 'ai-dialog-overlay';
var transitionEvent = function () {
  var transition = null;

  return function () {
    if (transition) return transition;

    var t = void 0;
    var el = _aureliaPal.DOM.createElement('fakeelement');
    var transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };
    for (t in transitions) {
      if (el.style[t] !== undefined) {
        transition = transitions[t];
        return transition;
      }
    }
  };
}();

var DialogRenderer = exports.DialogRenderer = (_dec6 = (0, _aureliaDependencyInjection.transient)(), _dec6(_class12 = function () {
  function DialogRenderer() {
    var _this3 = this;

    _classCallCheck(this, DialogRenderer);

    this.dialogControllers = [];

    this.escapeKeyEvent = function (e) {
      if (e.keyCode === 27) {
        var top = _this3.dialogControllers[_this3.dialogControllers.length - 1];
        if (top && top.settings.lock !== true) {
          top.cancel();
        }
      }
    };

    this.defaultSettings = dialogOptions;
  }

  DialogRenderer.prototype.getDialogContainer = function getDialogContainer() {
    return _aureliaPal.DOM.createElement('div');
  };

  DialogRenderer.prototype.showDialog = function showDialog(dialogController) {
    if (!dialogController.showDialog) {
      return this._createDialogHost(dialogController).then(function () {
        return dialogController.showDialog();
      });
    }
    return dialogController.showDialog();
  };

  DialogRenderer.prototype.hideDialog = function hideDialog(dialogController) {
    return dialogController.hideDialog().then(function () {
      return dialogController.destroyDialogHost();
    });
  };

  DialogRenderer.prototype._createDialogHost = function _createDialogHost(dialogController) {
    var _this4 = this;

    var settings = dialogController.settings;
    var modalOverlay = _aureliaPal.DOM.createElement(overlayTagName);
    var modalContainer = _aureliaPal.DOM.createElement(containerTagName);
    var wrapper = document.createElement('div');
    var anchor = dialogController.slot.anchor;
    wrapper.appendChild(anchor);
    modalContainer.appendChild(wrapper);
    var body = _aureliaPal.DOM.querySelectorAll('body')[0];
    var closeModalClick = function closeModalClick(e) {
      if (!settings.lock && !e._aureliaDialogHostClicked) {
        dialogController.cancel();
      } else {
        return false;
      }
    };

    var stopPropagation = function stopPropagation(e) {
      e._aureliaDialogHostClicked = true;
    };

    var dialogHost = modalContainer.querySelector('ai-dialog');

    dialogController.showDialog = function () {
      if (!_this4.dialogControllers.length) {
        _aureliaPal.DOM.addEventListener('keyup', _this4.escapeKeyEvent);
      }

      _this4.dialogControllers.push(dialogController);

      dialogController.slot.attached();

      if (typeof settings.position === 'function') {
        settings.position(modalContainer, modalOverlay);
      } else {
        dialogController.centerDialog();
      }

      modalContainer.addEventListener('click', closeModalClick);
      dialogHost.addEventListener('click', stopPropagation);

      return new Promise(function (resolve) {
        modalContainer.addEventListener(transitionEvent(), onTransitionEnd);

        function onTransitionEnd(e) {
          if (e.target !== modalContainer) {
            return;
          }
          modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
          resolve();
        }

        modalOverlay.classList.add('active');
        modalContainer.classList.add('active');
        body.classList.add('ai-dialog-open');
      });
    };

    dialogController.hideDialog = function () {
      modalContainer.removeEventListener('click', closeModalClick);
      dialogHost.removeEventListener('click', stopPropagation);

      var i = _this4.dialogControllers.indexOf(dialogController);
      if (i !== -1) {
        _this4.dialogControllers.splice(i, 1);
      }

      if (!_this4.dialogControllers.length) {
        _aureliaPal.DOM.removeEventListener('keyup', _this4.escapeKeyEvent);
      }

      return new Promise(function (resolve) {
        modalContainer.addEventListener(transitionEvent(), onTransitionEnd);

        function onTransitionEnd() {
          modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
          resolve();
        }

        modalOverlay.classList.remove('active');
        modalContainer.classList.remove('active');

        if (!_this4.dialogControllers.length) {
          body.classList.remove('ai-dialog-open');
        }
      });
    };

    dialogController.centerDialog = function () {
      if (settings.centerHorizontalOnly) return;
      centerDialog(modalContainer);
    };

    dialogController.destroyDialogHost = function () {
      body.removeChild(modalOverlay);
      body.removeChild(modalContainer);
      dialogController.slot.detached();
      return Promise.resolve();
    };

    modalOverlay.style.zIndex = this.defaultSettings.startingZIndex;
    modalContainer.style.zIndex = this.defaultSettings.startingZIndex;

    var lastContainer = Array.from(body.querySelectorAll(containerTagName)).pop();

    if (lastContainer) {
      lastContainer.parentNode.insertBefore(modalContainer, lastContainer.nextSibling);
      lastContainer.parentNode.insertBefore(modalOverlay, lastContainer.nextSibling);
    } else {
      body.insertBefore(modalContainer, body.firstChild);
      body.insertBefore(modalOverlay, body.firstChild);
    }

    return Promise.resolve();
  };

  return DialogRenderer;
}()) || _class12);


function centerDialog(modalContainer) {
  var child = modalContainer.children[0];
  var vh = Math.max(_aureliaPal.DOM.querySelectorAll('html')[0].clientHeight, window.innerHeight || 0);

  child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
  child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
}

var DialogService = exports.DialogService = (_temp4 = _class14 = function () {
  function DialogService(container, compositionEngine) {
    _classCallCheck(this, DialogService);

    this.container = container;
    this.compositionEngine = compositionEngine;
    this.controllers = [];
    this.hasActiveDialog = false;
  }

  DialogService.prototype.open = function open(settings) {
    var _this5 = this;

    var dialogController = void 0;

    var promise = new Promise(function (resolve, reject) {
      var childContainer = _this5.container.createChild();
      dialogController = new DialogController(childContainer.get(Renderer), settings, resolve, reject);
      childContainer.registerInstance(DialogController, dialogController);
      var host = dialogController._renderer.getDialogContainer();

      var instruction = {
        container: _this5.container,
        childContainer: childContainer,
        model: dialogController.settings.model,
        viewModel: dialogController.settings.viewModel,
        viewSlot: new _aureliaTemplating.ViewSlot(host, true),
        host: host
      };

      return _getViewModel(instruction, _this5.compositionEngine).then(function (returnedInstruction) {
        dialogController.viewModel = returnedInstruction.viewModel;
        dialogController.slot = returnedInstruction.viewSlot;

        return invokeLifecycle(dialogController.viewModel, 'canActivate', dialogController.settings.model).then(function (canActivate) {
          if (canActivate) {
            _this5.controllers.push(dialogController);
            _this5.hasActiveDialog = !!_this5.controllers.length;

            return _this5.compositionEngine.compose(returnedInstruction).then(function (controller) {
              dialogController.controller = controller;
              dialogController.view = controller.view;

              return dialogController._renderer.showDialog(dialogController);
            });
          }
        });
      });
    });

    return promise.then(function (result) {
      var i = _this5.controllers.indexOf(dialogController);
      if (i !== -1) {
        _this5.controllers.splice(i, 1);
        _this5.hasActiveDialog = !!_this5.controllers.length;
      }

      return result;
    });
  };

  return DialogService;
}(), _class14.inject = [_aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine], _temp4);


function _getViewModel(instruction, compositionEngine) {
  if (typeof instruction.viewModel === 'function') {
    instruction.viewModel = _aureliaMetadata.Origin.get(instruction.viewModel).moduleId;
  }

  if (typeof instruction.viewModel === 'string') {
    return compositionEngine.ensureViewModel(instruction);
  }

  return Promise.resolve(instruction);
}

var defaultRenderer = DialogRenderer;
var resources = {
  'ai-dialog': './resources/ai-dialog',
  'ai-dialog-header': './resources/ai-dialog-header',
  'ai-dialog-body': './resources/ai-dialog-body',
  'ai-dialog-footer': './resources/ai-dialog-footer',
  'attach-focus': './resources/attach-focus'
};

var DialogConfiguration = exports.DialogConfiguration = function () {
  function DialogConfiguration(aurelia) {
    _classCallCheck(this, DialogConfiguration);

    this.aurelia = aurelia;
    this.settings = dialogOptions;
  }

  DialogConfiguration.prototype.useDefaults = function useDefaults() {
    return this.useRenderer(defaultRenderer).useResource('ai-dialog').useResource('ai-dialog-header').useResource('ai-dialog-body').useResource('ai-dialog-footer').useResource('attach-focus');
  };

  DialogConfiguration.prototype.useResource = function useResource(resourceName) {
    this.aurelia.globalResources(resources[resourceName]);
    return this;
  };

  DialogConfiguration.prototype.useRenderer = function useRenderer(renderer, settings) {
    this.aurelia.singleton(Renderer, renderer);
    this.settings = Object.assign(dialogOptions, settings);
    return this;
  };

  return DialogConfiguration;
}();
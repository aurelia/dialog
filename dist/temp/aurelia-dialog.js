'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

exports.invokeLifecycle = invokeLifecycle;

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaTemplating = require('aurelia-templating');

var _aureliaMetadata = require('aurelia-metadata');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var AiDialogBody = (function () {
  function AiDialogBody() {
    _classCallCheck(this, _AiDialogBody);
  }

  var _AiDialogBody = AiDialogBody;
  AiDialogBody = _aureliaTemplating.customElement('ai-dialog-body')(AiDialogBody) || AiDialogBody;
  return AiDialogBody;
})();

exports.AiDialogBody = AiDialogBody;

var AiDialogFooter = (function () {
  var _instanceInitializers = {};

  _createDecoratedClass(AiDialogFooter, [{
    key: 'buttons',
    decorators: [_aureliaTemplating.bindable],
    initializer: function initializer() {
      return [];
    },
    enumerable: true
  }, {
    key: 'useDefaultButtons',
    decorators: [_aureliaTemplating.bindable],
    initializer: function initializer() {
      return false;
    },
    enumerable: true
  }], [{
    key: 'inject',
    value: [DialogController],
    enumerable: true
  }], _instanceInitializers);

  function AiDialogFooter(controller) {
    _classCallCheck(this, _AiDialogFooter);

    _defineDecoratedPropertyDescriptor(this, 'buttons', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'useDefaultButtons', _instanceInitializers);

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

  var _AiDialogFooter = AiDialogFooter;
  AiDialogFooter = _aureliaTemplating.customElement('ai-dialog-footer')(AiDialogFooter) || AiDialogFooter;
  return AiDialogFooter;
})();

exports.AiDialogFooter = AiDialogFooter;

var AiDialogHeader = (function () {
  _createClass(AiDialogHeader, null, [{
    key: 'inject',
    value: [DialogController],
    enumerable: true
  }]);

  function AiDialogHeader(controller) {
    _classCallCheck(this, _AiDialogHeader);

    this.controller = controller;
  }

  var _AiDialogHeader = AiDialogHeader;
  AiDialogHeader = _aureliaTemplating.customElement('ai-dialog-header')(AiDialogHeader) || AiDialogHeader;
  return AiDialogHeader;
})();

exports.AiDialogHeader = AiDialogHeader;

var AiDialog = (function () {
  function AiDialog() {
    _classCallCheck(this, _AiDialog);
  }

  var _AiDialog = AiDialog;
  AiDialog = _aureliaTemplating.customElement('ai-dialog')(AiDialog) || AiDialog;
  return AiDialog;
})();

exports.AiDialog = AiDialog;

var AttachFocus = (function () {
  _createClass(AttachFocus, null, [{
    key: 'inject',
    value: [Element],
    enumerable: true
  }]);

  function AttachFocus(element) {
    _classCallCheck(this, _AttachFocus);

    this.element = element;
  }

  AttachFocus.prototype.attached = function attached() {
    this.element.focus();
  };

  var _AttachFocus = AttachFocus;
  AttachFocus = _aureliaTemplating.customAttribute('attach-focus')(AttachFocus) || AttachFocus;
  return AttachFocus;
})();

exports.AttachFocus = AttachFocus;

var DialogController = (function () {
  function DialogController(renderer, settings, resolve, reject) {
    _classCallCheck(this, DialogController);

    this._renderer = renderer;
    this.settings = settings;
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
      return _this._renderer.hideDialog(_this).then(function () {
        return _this._renderer.destroyDialogHost(_this).then(function () {
          _this.controller.unbind();
          _this._reject(message);
        });
      });
    });
  };

  DialogController.prototype.close = function close(ok, result) {
    var _this2 = this;

    var returnResult = new DialogResult(!ok, result);
    return invokeLifecycle(this.viewModel, 'canDeactivate').then(function (canDeactivate) {
      if (canDeactivate) {
        return invokeLifecycle(_this2.viewModel, 'deactivate').then(function () {
          return _this2._renderer.hideDialog(_this2).then(function () {
            return _this2._renderer.destroyDialogHost(_this2).then(function () {
              _this2.controller.unbind();
              _this2._resolve(returnResult);
            });
          });
        });
      }
    });
  };

  return DialogController;
})();

exports.DialogController = DialogController;

var DialogResult = function DialogResult(cancelled, result) {
  _classCallCheck(this, DialogResult);

  this.wasCancelled = false;

  this.wasCancelled = cancelled;
  this.output = result;
};

var currentZIndex = 1000;
var transitionEvent = (function () {
  var t = undefined;
  var el = document.createElement('fakeelement');

  var transitions = {
    'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd'
  };

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
})();

function getNextZIndex() {
  return ++currentZIndex;
}

var globalSettings = {
  lock: true,
  centerHorizontalOnly: false
};

exports.globalSettings = globalSettings;

var DialogRenderer = (function () {
  function DialogRenderer() {
    var _this3 = this;

    _classCallCheck(this, DialogRenderer);

    this.defaultSettings = globalSettings;

    this.dialogControllers = [];
    document.addEventListener('keyup', function (e) {
      if (e.keyCode === 27) {
        var _top = _this3.dialogControllers[_this3.dialogControllers.length - 1];
        if (_top && _top.settings.lock !== true) {
          _top.cancel();
        }
      }
    });
  }

  DialogRenderer.prototype.createDialogHost = function createDialogHost(dialogController) {
    var _this4 = this;

    var settings = dialogController.settings;
    var modalOverlay = document.createElement('ai-dialog-overlay');
    var modalContainer = document.createElement('ai-dialog-container');
    var body = document.body;

    modalOverlay.style.zIndex = getNextZIndex();
    modalContainer.style.zIndex = getNextZIndex();

    document.body.appendChild(modalOverlay);
    document.body.appendChild(modalContainer);

    dialogController.slot = new _aureliaTemplating.ViewSlot(modalContainer, true);
    dialogController.slot.add(dialogController.view);

    dialogController.showDialog = function () {
      _this4.dialogControllers.push(dialogController);

      dialogController.slot.attached();
      dialogController.centerDialog();

      modalOverlay.onclick = function () {
        if (!settings.lock) {
          dialogController.cancel();
        } else {
          return false;
        }
      };

      return new Promise(function (resolve) {
        modalContainer.addEventListener(transitionEvent, onTransitionEnd);

        function onTransitionEnd(e) {
          if (e.target !== modalContainer) {
            return;
          }
          modalContainer.removeEventListener(transitionEvent, onTransitionEnd);
          resolve();
        }

        modalOverlay.classList.add('active');
        modalContainer.classList.add('active');
        body.classList.add('ai-dialog-open');
      });
    };

    dialogController.hideDialog = function () {
      var i = _this4.dialogControllers.indexOf(dialogController);
      if (i !== -1) {
        _this4.dialogControllers.splice(i, 1);
      }

      return new Promise(function (resolve) {
        modalContainer.addEventListener(transitionEvent, onTransitionEnd);

        function onTransitionEnd() {
          modalContainer.removeEventListener(transitionEvent, onTransitionEnd);
          resolve();
        }

        modalOverlay.classList.remove('active');
        modalContainer.classList.remove('active');
        body.classList.remove('ai-dialog-open');
      });
    };

    dialogController.destroyDialogHost = function () {
      document.body.removeChild(modalOverlay);
      document.body.removeChild(modalContainer);
      dialogController.slot.detached();
      return Promise.resolve();
    };

    dialogController.centerDialog = function () {
      var child = modalContainer.children[0];

      if (!settings.centerHorizontalOnly) {
        var vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
      }
    };

    return Promise.resolve();
  };

  DialogRenderer.prototype.showDialog = function showDialog(dialogController) {
    return dialogController.showDialog();
  };

  DialogRenderer.prototype.hideDialog = function hideDialog(dialogController) {
    return dialogController.hideDialog();
  };

  DialogRenderer.prototype.destroyDialogHost = function destroyDialogHost(dialogController) {
    return dialogController.destroyDialogHost();
  };

  return DialogRenderer;
})();

exports.DialogRenderer = DialogRenderer;

var DialogService = (function () {
  _createClass(DialogService, null, [{
    key: 'inject',
    value: [_aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine, DialogRenderer],
    enumerable: true
  }]);

  function DialogService(container, compositionEngine, renderer) {
    _classCallCheck(this, DialogService);

    this.container = container;
    this.compositionEngine = compositionEngine;
    this.renderer = renderer;
  }

  DialogService.prototype._getViewModel = function _getViewModel(instruction) {
    if (typeof instruction.viewModel === 'function') {
      instruction.viewModel = _aureliaMetadata.Origin.get(instruction.viewModel).moduleId;
    }

    if (typeof instruction.viewModel === 'string') {
      return this.compositionEngine.ensureViewModel(instruction);
    }

    return Promise.resolve(instruction);
  };

  DialogService.prototype.open = function open(settings) {
    var _this5 = this;

    var _settings = Object.assign({}, this.renderer.defaultSettings, settings);

    return new Promise(function (resolve, reject) {
      var childContainer = _this5.container.createChild();
      var dialogController = new DialogController(_this5.renderer, _settings, resolve, reject);
      var instruction = {
        viewModel: _settings.viewModel,
        container: _this5.container,
        childContainer: childContainer,
        model: _settings.model
      };

      childContainer.registerInstance(DialogController, dialogController);

      return _this5._getViewModel(instruction).then(function (returnedInstruction) {
        dialogController.viewModel = returnedInstruction.viewModel;

        return invokeLifecycle(returnedInstruction.viewModel, 'canActivate', _settings.model).then(function (canActivate) {
          if (canActivate) {
            return _this5.compositionEngine.createController(returnedInstruction).then(function (controller) {
              dialogController.controller = controller;
              dialogController.view = controller.view;
              controller.automate();

              return _this5.renderer.createDialogHost(dialogController).then(function () {
                return _this5.renderer.showDialog(dialogController);
              });
            });
          }
        });
      });
    });
  };

  return DialogService;
})();

exports.DialogService = DialogService;

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
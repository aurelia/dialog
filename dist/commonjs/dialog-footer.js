'use strict';

exports.__esModule = true;

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer.call(target); Object.defineProperty(target, key, descriptor); }

var _aureliaTemplating = require('aurelia-templating');

var _dialogController = require('./dialog-controller');

var DialogFooter = (function () {
  var _instanceInitializers = {};

  _createDecoratedClass(DialogFooter, [{
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
    value: [_dialogController.DialogController],
    enumerable: true
  }], _instanceInitializers);

  function DialogFooter(controller) {
    _classCallCheck(this, _DialogFooter);

    _defineDecoratedPropertyDescriptor(this, 'buttons', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'useDefaultButtons', _instanceInitializers);

    this.controller = controller;
  }

  DialogFooter.prototype.close = function close(buttonValue) {
    if (DialogFooter.isCancelButton(buttonValue)) {
      this.controller.cancel(buttonValue);
    } else {
      this.controller.ok(buttonValue);
    }
  };

  DialogFooter.prototype.useDefaultButtonsChanged = function useDefaultButtonsChanged(newValue) {
    if (newValue) {
      this.buttons = ['Cancel', 'Ok'];
    }
  };

  DialogFooter.isCancelButton = function isCancelButton(value) {
    return value === 'Cancel';
  };

  var _DialogFooter = DialogFooter;
  DialogFooter = _aureliaTemplating.customElement('dialog-footer')(DialogFooter) || DialogFooter;
  return DialogFooter;
})();

exports.DialogFooter = DialogFooter;
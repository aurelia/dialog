System.register(['aurelia-templating', './dialog-controller'], function (_export) {
  'use strict';

  var customElement, bindable, DialogController, AiDialogFooter;

  var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

  return {
    setters: [function (_aureliaTemplating) {
      customElement = _aureliaTemplating.customElement;
      bindable = _aureliaTemplating.bindable;
    }, function (_dialogController) {
      DialogController = _dialogController.DialogController;
    }],
    execute: function () {
      AiDialogFooter = (function () {
        var _instanceInitializers = {};

        _createDecoratedClass(AiDialogFooter, [{
          key: 'buttons',
          decorators: [bindable],
          initializer: function initializer() {
            return [];
          },
          enumerable: true
        }, {
          key: 'useDefaultButtons',
          decorators: [bindable],
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
        AiDialogFooter = customElement('ai-dialog-footer')(AiDialogFooter) || AiDialogFooter;
        return AiDialogFooter;
      })();

      _export('AiDialogFooter', AiDialogFooter);
    }
  };
});
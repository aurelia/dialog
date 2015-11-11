define(['exports', 'aurelia-metadata', 'aurelia-dependency-injection', 'aurelia-templating', './dialog-controller', './dialog-renderer', './lifecycle'], function (exports, _aureliaMetadata, _aureliaDependencyInjection, _aureliaTemplating, _dialogController, _dialogRenderer, _lifecycle) {
  'use strict';

  exports.__esModule = true;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var DialogService = (function () {
    _createClass(DialogService, null, [{
      key: 'inject',
      value: [_aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine, _dialogRenderer.DialogRenderer],
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
      var _this = this;

      var _settings = Object.assign({}, this.renderer.defaultSettings, settings);

      return new Promise(function (resolve, reject) {
        var childContainer = _this.container.createChild();
        var dialogController = new _dialogController.DialogController(_this.renderer, _settings, resolve, reject);
        var instruction = {
          viewModel: _settings.viewModel,
          container: _this.container,
          childContainer: childContainer,
          model: _settings.model
        };

        childContainer.registerInstance(_dialogController.DialogController, dialogController);

        return _this._getViewModel(instruction).then(function (returnedInstruction) {
          dialogController.viewModel = returnedInstruction.viewModel;

          return _lifecycle.invokeLifecycle(returnedInstruction.viewModel, 'canActivate', _settings.model).then(function (canActivate) {
            if (canActivate) {
              return _this.compositionEngine.createController(returnedInstruction).then(function (controller) {
                dialogController.controller = controller;
                dialogController.view = controller.view;
                controller.automate();

                return _this.renderer.createDialogHost(dialogController).then(function () {
                  return _this.renderer.showDialog(dialogController);
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
});
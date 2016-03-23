'use strict';

System.register(['aurelia-metadata', 'aurelia-dependency-injection', 'aurelia-templating', './dialog-controller', './renderers/renderer', './lifecycle'], function (_export, _context) {
  var Origin, Container, CompositionEngine, ViewSlot, DialogController, Renderer, invokeLifecycle, _class, _temp, DialogService;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaMetadata) {
      Origin = _aureliaMetadata.Origin;
    }, function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function (_aureliaTemplating) {
      CompositionEngine = _aureliaTemplating.CompositionEngine;
      ViewSlot = _aureliaTemplating.ViewSlot;
    }, function (_dialogController) {
      DialogController = _dialogController.DialogController;
    }, function (_renderersRenderer) {
      Renderer = _renderersRenderer.Renderer;
    }, function (_lifecycle) {
      invokeLifecycle = _lifecycle.invokeLifecycle;
    }],
    execute: function () {
      _export('DialogService', DialogService = (_temp = _class = function () {
        function DialogService(container, compositionEngine, renderer) {
          _classCallCheck(this, DialogService);

          this.container = container;
          this.compositionEngine = compositionEngine;
          this.renderer = renderer;
          this.controllers = [];
          this.hasActiveDialog = false;
        }

        DialogService.prototype.open = function open(settings) {
          var _this = this;

          var _settings = Object.assign({}, this.renderer.defaultSettings, settings);
          var dialogController = void 0;

          var promise = new Promise(function (resolve, reject) {
            var childContainer = _this.container.createChild();
            dialogController = new DialogController(_this.renderer, _settings, resolve, reject);
            var instruction = {
              viewModel: _settings.viewModel,
              container: _this.container,
              childContainer: childContainer,
              model: _settings.model
            };

            childContainer.registerInstance(DialogController, dialogController);

            return _this._getViewModel(instruction).then(function (returnedInstruction) {
              dialogController.viewModel = returnedInstruction.viewModel;

              return invokeLifecycle(returnedInstruction.viewModel, 'canActivate', _settings.model).then(function (canActivate) {
                if (canActivate) {
                  _this.controllers.push(dialogController);
                  _this.hasActiveDialog = !!_this.controllers.length;

                  return _this.compositionEngine.createController(returnedInstruction).then(function (controller) {
                    dialogController.controller = controller;
                    dialogController.view = controller.view;
                    controller.automate();

                    dialogController.slot = new ViewSlot(_this.renderer.getDialogContainer(), true);
                    dialogController.slot.add(dialogController.view);

                    return _this.renderer.showDialog(dialogController);
                  });
                }
              });
            });
          });

          return promise.then(function (result) {
            var i = _this.controllers.indexOf(dialogController);
            if (i !== -1) {
              _this.controllers.splice(i, 1);
              _this.hasActiveDialog = !!_this.controllers.length;
            }

            return result;
          });
        };

        DialogService.prototype._getViewModel = function _getViewModel(instruction) {
          if (typeof instruction.viewModel === 'function') {
            instruction.viewModel = Origin.get(instruction.viewModel).moduleId;
          }

          if (typeof instruction.viewModel === 'string') {
            return this.compositionEngine.ensureViewModel(instruction);
          }

          return Promise.resolve(instruction);
        };

        return DialogService;
      }(), _class.inject = [Container, CompositionEngine, Renderer], _temp));

      _export('DialogService', DialogService);
    }
  };
});
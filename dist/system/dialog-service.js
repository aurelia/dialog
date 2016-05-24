'use strict';

System.register(['aurelia-metadata', 'aurelia-dependency-injection', 'aurelia-templating', './dialog-controller', './renderers/renderer', './lifecycle'], function (_export, _context) {
  var Origin, Container, CompositionEngine, ViewSlot, DialogController, Renderer, invokeLifecycle, _class, _temp, DialogService;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _getViewModel(instruction, compositionEngine) {
    if (typeof instruction.viewModel === 'function') {
      instruction.viewModel = Origin.get(instruction.viewModel).moduleId;
    }

    if (typeof instruction.viewModel === 'string') {
      return compositionEngine.ensureViewModel(instruction);
    }

    return Promise.resolve(instruction);
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
        function DialogService(container, compositionEngine) {
          _classCallCheck(this, DialogService);

          this.container = container;
          this.compositionEngine = compositionEngine;
          this.controllers = [];
          this.hasActiveDialog = false;
        }

        DialogService.prototype.open = function open(settings) {
          var _this = this;

          var dialogController = void 0;

          var promise = new Promise(function (resolve, reject) {
            var childContainer = _this.container.createChild();
            dialogController = new DialogController(childContainer.get(Renderer), settings, resolve, reject);
            childContainer.registerInstance(DialogController, dialogController);
            var host = dialogController._renderer.getDialogContainer();

            var instruction = {
              container: _this.container,
              childContainer: childContainer,
              model: dialogController.settings.model,
              viewModel: dialogController.settings.viewModel,
              viewSlot: new ViewSlot(host, true),
              host: host
            };

            return _getViewModel(instruction, _this.compositionEngine).then(function (returnedInstruction) {
              dialogController.viewModel = returnedInstruction.viewModel;
              dialogController.slot = returnedInstruction.viewSlot;

              return invokeLifecycle(dialogController.viewModel, 'canActivate', dialogController.settings.model).then(function (canActivate) {
                if (canActivate) {
                  _this.controllers.push(dialogController);
                  _this.hasActiveDialog = !!_this.controllers.length;

                  return _this.compositionEngine.compose(returnedInstruction).then(function (controller) {
                    dialogController.controller = controller;
                    dialogController.view = controller.view;

                    return dialogController._renderer.showDialog(dialogController);
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

        return DialogService;
      }(), _class.inject = [Container, CompositionEngine], _temp));

      _export('DialogService', DialogService);
    }
  };
});
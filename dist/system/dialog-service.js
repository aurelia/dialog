'use strict';

System.register(['aurelia-metadata', 'aurelia-dependency-injection', 'aurelia-templating', './dialog-controller', './renderer', './lifecycle', './dialog-result'], function (_export, _context) {
  "use strict";

  var Origin, Container, CompositionEngine, ViewSlot, DialogController, Renderer, invokeLifecycle, DialogResult, _class, _temp, DialogService;

  

  function _openDialog(service, childContainer, dialogController) {
    var host = dialogController.renderer.getDialogContainer();
    var instruction = {
      container: service.container,
      childContainer: childContainer,
      model: dialogController.settings.model,
      view: dialogController.settings.view,
      viewModel: dialogController.settings.viewModel,
      viewSlot: new ViewSlot(host, true),
      host: host
    };

    return _getViewModel(instruction, service.compositionEngine).then(function (returnedInstruction) {
      dialogController.viewModel = returnedInstruction.viewModel;
      dialogController.slot = returnedInstruction.viewSlot;

      return invokeLifecycle(dialogController.viewModel, 'canActivate', dialogController.settings.model).then(function (canActivate) {
        if (canActivate) {
          service.controllers.push(dialogController);
          service.hasActiveDialog = !!service.controllers.length;

          return service.compositionEngine.compose(returnedInstruction).then(function (controller) {
            dialogController.controller = controller;
            dialogController.view = controller.view;

            return dialogController.renderer.showDialog(dialogController);
          });
        }
      });
    });
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
    }, function (_renderer) {
      Renderer = _renderer.Renderer;
    }, function (_lifecycle) {
      invokeLifecycle = _lifecycle.invokeLifecycle;
    }, function (_dialogResult) {
      DialogResult = _dialogResult.DialogResult;
    }],
    execute: function () {
      _export('DialogService', DialogService = (_temp = _class = function () {
        function DialogService(container, compositionEngine) {
          

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
            return _openDialog(_this, childContainer, dialogController);
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

        DialogService.prototype.openAndYieldController = function openAndYieldController(settings) {
          var _this2 = this;

          var childContainer = this.container.createChild();
          var dialogController = new DialogController(childContainer.get(Renderer), settings, null, null);
          childContainer.registerInstance(DialogController, dialogController);

          dialogController.result = new Promise(function (resolve, reject) {
            dialogController._resolve = resolve;
            dialogController._reject = reject;
          }).then(function (result) {
            var i = _this2.controllers.indexOf(dialogController);
            if (i !== -1) {
              _this2.controllers.splice(i, 1);
              _this2.hasActiveDialog = !!_this2.controllers.length;
            }
            return result;
          });

          return _openDialog(this, childContainer, dialogController).then(function () {
            return dialogController;
          });
        };

        return DialogService;
      }(), _class.inject = [Container, CompositionEngine], _temp));

      _export('DialogService', DialogService);
    }
  };
});
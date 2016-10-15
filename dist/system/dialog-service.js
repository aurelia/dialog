'use strict';

System.register(['aurelia-metadata', 'aurelia-dependency-injection', 'aurelia-templating', './dialog-controller', './renderer', './lifecycle', './dialog-result', './dialog-options'], function (_export, _context) {
  "use strict";

  var Origin, Container, CompositionEngine, ViewSlot, DialogController, Renderer, invokeLifecycle, DialogResult, dialogOptions, _class, _temp, DialogService;

  

  function _createSettings(settings) {
    settings = Object.assign({}, dialogOptions, settings);
    settings.startingZIndex = dialogOptions.startingZIndex;
    return settings;
  }

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
          return service.compositionEngine.compose(returnedInstruction).then(function (controller) {
            service.controllers.push(dialogController);
            service.hasActiveDialog = !!service.controllers.length;
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

  function _removeController(service, controller) {
    var i = service.controllers.indexOf(controller);
    if (i !== -1) {
      service.controllers.splice(i, 1);
      service.hasActiveDialog = !!service.controllers.length;
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
    }, function (_renderer) {
      Renderer = _renderer.Renderer;
    }, function (_lifecycle) {
      invokeLifecycle = _lifecycle.invokeLifecycle;
    }, function (_dialogResult) {
      DialogResult = _dialogResult.DialogResult;
    }, function (_dialogOptions) {
      dialogOptions = _dialogOptions.dialogOptions;
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
          return this.openAndYieldController(settings).then(function (controller) {
            return controller.result;
          });
        };

        DialogService.prototype.openAndYieldController = function openAndYieldController(settings) {
          var _this = this;

          var childContainer = this.container.createChild();
          var dialogController = void 0;
          var promise = new Promise(function (resolve, reject) {
            dialogController = new DialogController(childContainer.get(Renderer), _createSettings(settings), resolve, reject);
          });
          childContainer.registerInstance(DialogController, dialogController);
          dialogController.result = promise;
          dialogController.result.then(function () {
            _removeController(_this, dialogController);
          }, function () {
            _removeController(_this, dialogController);
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
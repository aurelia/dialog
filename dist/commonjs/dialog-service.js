'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DialogService = undefined;

var _class, _temp;

var _aureliaMetadata = require('aurelia-metadata');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

var _dialogController = require('./dialog-controller');

var _renderer = require('./renderers/renderer');

var _lifecycle = require('./lifecycle');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DialogService = exports.DialogService = (_temp = _class = function () {
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
      dialogController = new _dialogController.DialogController(childContainer.get(_renderer.Renderer), settings, resolve, reject);
      childContainer.registerInstance(_dialogController.DialogController, dialogController);
      var host = dialogController._renderer.getDialogContainer();

      var instruction = {
        container: _this.container,
        childContainer: childContainer,
        model: dialogController.settings.model,
        viewModel: dialogController.settings.viewModel,
        viewSlot: new _aureliaTemplating.ViewSlot(host, true),
        host: host
      };

      return _getViewModel(instruction, _this.compositionEngine).then(function (returnedInstruction) {
        dialogController.viewModel = returnedInstruction.viewModel;
        dialogController.slot = returnedInstruction.viewSlot;

        return (0, _lifecycle.invokeLifecycle)(dialogController.viewModel, 'canActivate', dialogController.settings.model).then(function (canActivate) {
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
}(), _class.inject = [_aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine], _temp);


function _getViewModel(instruction, compositionEngine) {
  if (typeof instruction.viewModel === 'function') {
    instruction.viewModel = _aureliaMetadata.Origin.get(instruction.viewModel).moduleId;
  }

  if (typeof instruction.viewModel === 'string') {
    return compositionEngine.ensureViewModel(instruction);
  }

  return Promise.resolve(instruction);
}
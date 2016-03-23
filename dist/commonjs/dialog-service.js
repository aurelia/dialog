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
      dialogController = new _dialogController.DialogController(_this.renderer, _settings, resolve, reject);
      var instruction = {
        viewModel: _settings.viewModel,
        container: _this.container,
        childContainer: childContainer,
        model: _settings.model
      };

      childContainer.registerInstance(_dialogController.DialogController, dialogController);

      return _this._getViewModel(instruction).then(function (returnedInstruction) {
        dialogController.viewModel = returnedInstruction.viewModel;

        return (0, _lifecycle.invokeLifecycle)(returnedInstruction.viewModel, 'canActivate', _settings.model).then(function (canActivate) {
          if (canActivate) {
            _this.controllers.push(dialogController);
            _this.hasActiveDialog = !!_this.controllers.length;

            return _this.compositionEngine.createController(returnedInstruction).then(function (controller) {
              dialogController.controller = controller;
              dialogController.view = controller.view;
              controller.automate();

              dialogController.slot = new _aureliaTemplating.ViewSlot(_this.renderer.getDialogContainer(), true);
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
      instruction.viewModel = _aureliaMetadata.Origin.get(instruction.viewModel).moduleId;
    }

    if (typeof instruction.viewModel === 'string') {
      return this.compositionEngine.ensureViewModel(instruction);
    }

    return Promise.resolve(instruction);
  };

  return DialogService;
}(), _class.inject = [_aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine, _renderer.Renderer], _temp);
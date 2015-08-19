'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaMetadata = require('aurelia-metadata');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

var _dialogController = require('./dialog-controller');

var _dialogRenderer = require('./dialog-renderer');

var _lifecycle = require('./lifecycle');

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
      return this.compositionEngine.createViewModel(instruction);
    } else {
      return Promise.resolve(instruction);
    }
  };

  DialogService.prototype.open = function open(settings) {
    var _this = this;

    settings = Object.assign({}, this.renderer.defaultSettings, settings);

    return new Promise(function (resolve, reject) {
      var childContainer = _this.container.createChild(),
          controller = new _dialogController.DialogController(_this.renderer, settings, resolve, reject),
          instruction = {
        viewModel: settings.viewModel,
        container: _this.container,
        childContainer: childContainer,
        model: settings.model
      };

      childContainer.registerInstance(_dialogController.DialogController, controller);

      return _this._getViewModel(instruction).then(function (instruction) {
        controller.viewModel = instruction.viewModel;

        return _lifecycle.invokeLifecycle(instruction.viewModel, 'canActivate', settings.model).then(function (canActivate) {
          if (canActivate) {
            return _this.compositionEngine.createBehavior(instruction).then(function (behavior) {
              controller.behavior = behavior;
              controller.view = behavior.view;
              behavior.view.bind(behavior.executionContext);

              return _this.renderer.createDialogHost(controller).then(function () {
                return _this.renderer.showDialog(controller);
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
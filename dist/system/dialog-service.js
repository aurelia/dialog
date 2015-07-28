System.register(['aurelia-metadata', 'aurelia-dependency-injection', 'aurelia-templating', './dialog-controller', './dialog-renderer', './lifecycle'], function (_export) {
  'use strict';

  var Origin, Container, CompositionEngine, DialogController, DialogRenderer, invokeLifecycle, DialogService;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaMetadata) {
      Origin = _aureliaMetadata.Origin;
    }, function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function (_aureliaTemplating) {
      CompositionEngine = _aureliaTemplating.CompositionEngine;
    }, function (_dialogController) {
      DialogController = _dialogController.DialogController;
    }, function (_dialogRenderer) {
      DialogRenderer = _dialogRenderer.DialogRenderer;
    }, function (_lifecycle) {
      invokeLifecycle = _lifecycle.invokeLifecycle;
    }],
    execute: function () {
      DialogService = (function () {
        function DialogService(container, compositionEngine, renderer) {
          _classCallCheck(this, DialogService);

          this.container = container;
          this.compositionEngine = compositionEngine;
          this.renderer = renderer;
        }

        DialogService.prototype._getViewModel = function _getViewModel(instruction) {
          if (typeof instruction.viewModel === 'function') {
            instruction.viewModel = Origin.get(instruction.viewModel).moduleId;
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
            console.log('creating');
            var childContainer = _this.container.createChild(),
                controller = new DialogController(_this.renderer, settings, resolve, reject),
                instruction = {
              viewModel: settings.viewModel,
              container: _this.container,
              childContainer: childContainer,
              model: settings.model
            };
            console.log(controller);

            childContainer.registerInstance(DialogController, controller);

            return _this._getViewModel(instruction).then(function (instruction) {
              controller.viewModel = instruction.viewModel;

              return invokeLifecycle(instruction.viewModel, 'canActivate', settings.model).then(function (canActivate) {
                if (canActivate) {
                  return _this.compositionEngine.createBehavior(instruction).then(function (behavior) {
                    controller.behavior = behavior;
                    controller.view = behavior.view;
                    behavior.view.bind(behavior.executionContext);

                    return _this.renderer.createDialogHost(controller).then(function () {
                      return _this.renderer.showDialog(controller);
                    });
                  });
                } else {
                  return Promise.reject();
                }
              });
            });
          });
        };

        _createClass(DialogService, null, [{
          key: 'inject',
          value: [Container, CompositionEngine, DialogRenderer],
          enumerable: true
        }]);

        return DialogService;
      })();

      _export('DialogService', DialogService);
    }
  };
});
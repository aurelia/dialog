'use strict';

System.register(['./lifecycle', './dialog-result'], function (_export, _context) {
  "use strict";

  var invokeLifecycle, DialogResult, DialogController;

  

  return {
    setters: [function (_lifecycle) {
      invokeLifecycle = _lifecycle.invokeLifecycle;
    }, function (_dialogResult) {
      DialogResult = _dialogResult.DialogResult;
    }],
    execute: function () {
      _export('DialogController', DialogController = function () {
        function DialogController(renderer, settings, resolve, reject) {
          

          this.renderer = renderer;
          this.settings = settings;
          this._resolve = resolve;
          this._reject = reject;
        }

        DialogController.prototype.ok = function ok(output) {
          return this.close(true, output);
        };

        DialogController.prototype.cancel = function cancel(output) {
          return this.close(false, output);
        };

        DialogController.prototype.error = function error(message) {
          var _this = this;

          return invokeLifecycle(this.viewModel, 'deactivate').then(function () {
            return _this.renderer.hideDialog(_this);
          }).then(function () {
            _this.controller.unbind();
            _this._reject(message);
          });
        };

        DialogController.prototype.close = function close(ok, output) {
          var _this2 = this;

          if (this._closePromise) {
            return this._closePromise;
          }

          this._closePromise = invokeLifecycle(this.viewModel, 'canDeactivate').then(function (canDeactivate) {
            if (canDeactivate) {
              return invokeLifecycle(_this2.viewModel, 'deactivate').then(function () {
                return _this2.renderer.hideDialog(_this2);
              }).then(function () {
                var result = new DialogResult(!ok, output);
                _this2.controller.unbind();
                _this2._resolve(result);
                return result;
              });
            }

            _this2._closePromise = undefined;
          }, function (e) {
            _this2._closePromise = undefined;
            return Promise.reject(e);
          });

          return this._closePromise;
        };

        return DialogController;
      }());

      _export('DialogController', DialogController);
    }
  };
});
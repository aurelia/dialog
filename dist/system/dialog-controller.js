System.register(['./lifecycle'], function (_export) {
  'use strict';

  var invokeLifecycle, DialogController, DialogResult;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_lifecycle) {
      invokeLifecycle = _lifecycle.invokeLifecycle;
    }],
    execute: function () {
      DialogController = (function () {
        function DialogController(renderer, settings, resolve, reject) {
          _classCallCheck(this, DialogController);

          this._renderer = renderer;
          this.settings = settings;
          this._resolve = resolve;
          this._reject = reject;
        }

        DialogController.prototype.ok = function ok(result) {
          this.close(true, result);
        };

        DialogController.prototype.cancel = function cancel(result) {
          this.close(false, result);
        };

        DialogController.prototype.error = function error(message) {
          var _this = this;

          return invokeLifecycle(this.viewModel, 'deactivate').then(function () {
            return _this._renderer.hideDialog(_this).then(function () {
              return _this._renderer.destroyDialogHost(_this).then(function () {
                _this.controller.unbind();
                _this._reject(message);
              });
            });
          });
        };

        DialogController.prototype.close = function close(ok, result) {
          var _this2 = this;

          var returnResult = new DialogResult(!ok, result);
          return invokeLifecycle(this.viewModel, 'canDeactivate').then(function (canDeactivate) {
            if (canDeactivate) {
              return invokeLifecycle(_this2.viewModel, 'deactivate').then(function () {
                return _this2._renderer.hideDialog(_this2).then(function () {
                  return _this2._renderer.destroyDialogHost(_this2).then(function () {
                    _this2.controller.unbind();
                    _this2._resolve(returnResult);
                  });
                });
              });
            }
          });
        };

        return DialogController;
      })();

      _export('DialogController', DialogController);

      DialogResult = function DialogResult(cancelled, result) {
        _classCallCheck(this, DialogResult);

        this.wasCancelled = false;

        this.wasCancelled = cancelled;
        this.output = result;
      };
    }
  };
});
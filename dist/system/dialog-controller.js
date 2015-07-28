System.register(['./lifecycle'], function (_export) {
  'use strict';

  var invokeLifecycle, DialogController;

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

        DialogController.prototype.close = function close(success, result) {
          var _this = this;

          return invokeLifecycle(this.viewModel, 'canDeactivate').then(function (canDeactivate) {
            if (canDeactivate) {
              return invokeLifecycle(_this.viewModel, 'deactivate').then(function () {
                return _this._renderer.hideDialog(_this).then(function () {
                  return _this._renderer.destroyDialogHost(_this).then(function () {
                    _this.behavior.unbind();

                    if (success) {
                      _this._resolve(result);
                    } else {
                      _this._reject(result);
                    }
                  });
                });
              });
            }

            return Promise.reject();
          });
        };

        return DialogController;
      })();

      _export('DialogController', DialogController);
    }
  };
});
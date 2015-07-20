'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lifecycle = require('./lifecycle');

var DialogController = (function () {
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

    return _lifecycle.invokeLifecycle(this.viewModel, 'canDeactivate').then(function (canDeactivate) {
      if (canDeactivate) {
        return _lifecycle.invokeLifecycle(_this.viewModel, 'deactivate').then(function () {
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

exports.DialogController = DialogController;
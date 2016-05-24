define(['exports', './lifecycle'], function (exports, _lifecycle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogResult = exports.DialogController = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var DialogController = exports.DialogController = function () {
    function DialogController(renderer, settings, resolve, reject) {
      _classCallCheck(this, DialogController);

      this._renderer = renderer;
      this.settings = Object.assign({}, this._renderer.defaultSettings, settings);
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

      return (0, _lifecycle.invokeLifecycle)(this.viewModel, 'deactivate').then(function () {
        return _this._renderer.hideDialog(_this);
      }).then(function () {
        _this.controller.unbind();
        _this._reject(message);
      });
    };

    DialogController.prototype.close = function close(ok, result) {
      var _this2 = this;

      var returnResult = new DialogResult(!ok, result);
      return (0, _lifecycle.invokeLifecycle)(this.viewModel, 'canDeactivate').then(function (canDeactivate) {
        if (canDeactivate) {
          return (0, _lifecycle.invokeLifecycle)(_this2.viewModel, 'deactivate').then(function () {
            return _this2._renderer.hideDialog(_this2);
          }).then(function () {
            _this2.controller.unbind();
            _this2._resolve(returnResult);
          });
        }
      });
    };

    return DialogController;
  }();

  var DialogResult = exports.DialogResult = function DialogResult(cancelled, result) {
    _classCallCheck(this, DialogResult);

    this.wasCancelled = false;

    this.wasCancelled = cancelled;
    this.output = result;
  };
});
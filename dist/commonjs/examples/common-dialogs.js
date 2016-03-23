'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommonDialogs = undefined;

var _class, _temp;

var _prompt = require('./prompt');

var _dialogService = require('../dialog-service');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CommonDialogs = exports.CommonDialogs = (_temp = _class = function () {
  function CommonDialogs(dialogService) {
    _classCallCheck(this, CommonDialogs);

    this.dialogService = dialogService;
  }

  CommonDialogs.prototype.prompt = function prompt(question) {
    return this.dialogService.open({ viewModel: _prompt.Prompt, model: question });
  };

  return CommonDialogs;
}(), _class.inject = [_dialogService.DialogService], _temp);
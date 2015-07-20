'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _prompt = require('./prompt');

var _dialogService = require('../dialog-service');

var CommonDialogs = (function () {
  _createClass(CommonDialogs, null, [{
    key: 'inject',
    value: [_dialogService.DialogService],
    enumerable: true
  }]);

  function CommonDialogs(dialogService) {
    _classCallCheck(this, CommonDialogs);

    this.dialogService = dialogService;
  }

  CommonDialogs.prototype.prompt = function prompt(question) {
    return this.dialogService.open({ viewModel: _prompt.Prompt, model: question });
  };

  return CommonDialogs;
})();

exports.CommonDialogs = CommonDialogs;
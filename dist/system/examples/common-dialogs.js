'use strict';

System.register(['./prompt', '../dialog-service'], function (_export, _context) {
  var Prompt, DialogService, _class, _temp, CommonDialogs;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_prompt) {
      Prompt = _prompt.Prompt;
    }, function (_dialogService) {
      DialogService = _dialogService.DialogService;
    }],
    execute: function () {
      _export('CommonDialogs', CommonDialogs = (_temp = _class = function () {
        function CommonDialogs(dialogService) {
          _classCallCheck(this, CommonDialogs);

          this.dialogService = dialogService;
        }

        CommonDialogs.prototype.prompt = function prompt(question) {
          return this.dialogService.open({ viewModel: Prompt, model: question });
        };

        return CommonDialogs;
      }(), _class.inject = [DialogService], _temp));

      _export('CommonDialogs', CommonDialogs);
    }
  };
});
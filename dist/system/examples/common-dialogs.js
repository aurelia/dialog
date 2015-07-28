System.register(['./prompt', '../dialog-service'], function (_export) {
  'use strict';

  var Prompt, DialogService, CommonDialogs;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_prompt) {
      Prompt = _prompt.Prompt;
    }, function (_dialogService) {
      DialogService = _dialogService.DialogService;
    }],
    execute: function () {
      CommonDialogs = (function () {
        _createClass(CommonDialogs, null, [{
          key: 'inject',
          value: [DialogService],
          enumerable: true
        }]);

        function CommonDialogs(dialogService) {
          _classCallCheck(this, CommonDialogs);

          this.dialogService = dialogService;
        }

        CommonDialogs.prototype.prompt = function prompt(question) {
          return this.dialogService.open({ viewModel: Prompt, model: question });
        };

        return CommonDialogs;
      })();

      _export('CommonDialogs', CommonDialogs);
    }
  };
});
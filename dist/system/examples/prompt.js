'use strict';

System.register(['../dialog-controller'], function (_export, _context) {
  var DialogController, _class, _temp, Prompt;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_dialogController) {
      DialogController = _dialogController.DialogController;
    }],
    execute: function () {
      _export('Prompt', Prompt = (_temp = _class = function () {
        function Prompt(controller) {
          _classCallCheck(this, Prompt);

          this.controller = controller;
          this.answer = null;

          controller.settings.lock = false;
        }

        Prompt.prototype.activate = function activate(question) {
          this.question = question;
        };

        return Prompt;
      }(), _class.inject = [DialogController], _temp));

      _export('Prompt', Prompt);
    }
  };
});
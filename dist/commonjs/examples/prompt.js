'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dialogController = require('../dialog-controller');

var Prompt = (function () {
  _createClass(Prompt, null, [{
    key: 'inject',
    value: [_dialogController.DialogController],
    enumerable: true
  }]);

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
})();

exports.Prompt = Prompt;
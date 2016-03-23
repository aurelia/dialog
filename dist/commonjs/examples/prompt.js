'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Prompt = undefined;

var _class, _temp;

var _dialogController = require('../dialog-controller');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Prompt = exports.Prompt = (_temp = _class = function () {
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
}(), _class.inject = [_dialogController.DialogController], _temp);
define(['exports', 'aurelia-templating', '../dialog-controller'], function (exports, _aureliaTemplating, _dialogController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogHeader = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class, _class2, _temp;

  var AiDialogHeader = exports.AiDialogHeader = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-header'), _dec(_class = (_temp = _class2 = function AiDialogHeader(controller) {
    _classCallCheck(this, AiDialogHeader);

    this.controller = controller;
  }, _class2.inject = [_dialogController.DialogController], _temp)) || _class);
});
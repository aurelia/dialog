'use strict';

System.register(['aurelia-templating', '../dialog-controller'], function (_export, _context) {
  var customElement, DialogController, _dec, _class, _class2, _temp, AiDialogHeader;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaTemplating) {
      customElement = _aureliaTemplating.customElement;
    }, function (_dialogController) {
      DialogController = _dialogController.DialogController;
    }],
    execute: function () {
      _export('AiDialogHeader', AiDialogHeader = (_dec = customElement('ai-dialog-header'), _dec(_class = (_temp = _class2 = function AiDialogHeader(controller) {
        _classCallCheck(this, AiDialogHeader);

        this.controller = controller;
      }, _class2.inject = [DialogController], _temp)) || _class));

      _export('AiDialogHeader', AiDialogHeader);
    }
  };
});
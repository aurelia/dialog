'use strict';

System.register(['aurelia-templating'], function (_export, _context) {
  var customElement, _dec, _class, AiDialogBody;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaTemplating) {
      customElement = _aureliaTemplating.customElement;
    }],
    execute: function () {
      _export('AiDialogBody', AiDialogBody = (_dec = customElement('ai-dialog-body'), _dec(_class = function AiDialogBody() {
        _classCallCheck(this, AiDialogBody);
      }) || _class));

      _export('AiDialogBody', AiDialogBody);
    }
  };
});
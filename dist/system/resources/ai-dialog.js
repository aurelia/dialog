'use strict';

System.register(['aurelia-templating'], function (_export, _context) {
  var customElement, _dec, _class, AiDialog;

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
      _export('AiDialog', AiDialog = (_dec = customElement('ai-dialog'), _dec(_class = function AiDialog() {
        _classCallCheck(this, AiDialog);
      }) || _class));

      _export('AiDialog', AiDialog);
    }
  };
});
System.register(['aurelia-templating'], function (_export) {
  'use strict';

  var customElement, AiDialogBody;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaTemplating) {
      customElement = _aureliaTemplating.customElement;
    }],
    execute: function () {
      AiDialogBody = (function () {
        function AiDialogBody() {
          _classCallCheck(this, _AiDialogBody);
        }

        var _AiDialogBody = AiDialogBody;
        AiDialogBody = customElement('ai-dialog-body')(AiDialogBody) || AiDialogBody;
        return AiDialogBody;
      })();

      _export('AiDialogBody', AiDialogBody);
    }
  };
});
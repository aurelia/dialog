System.register(['aurelia-templating'], function (_export) {
  'use strict';

  var customElement, AiDialog;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaTemplating) {
      customElement = _aureliaTemplating.customElement;
    }],
    execute: function () {
      AiDialog = (function () {
        function AiDialog() {
          _classCallCheck(this, _AiDialog);
        }

        var _AiDialog = AiDialog;
        AiDialog = customElement('ai-dialog')(AiDialog) || AiDialog;
        return AiDialog;
      })();

      _export('AiDialog', AiDialog);
    }
  };
});
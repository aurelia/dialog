System.register(['aurelia-templating'], function (_export) {
  'use strict';

  var customElement, DialogBody;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaTemplating) {
      customElement = _aureliaTemplating.customElement;
    }],
    execute: function () {
      DialogBody = (function () {
        function DialogBody() {
          _classCallCheck(this, _DialogBody);
        }

        var _DialogBody = DialogBody;
        DialogBody = customElement('dialog-body')(DialogBody) || DialogBody;
        return DialogBody;
      })();

      _export('DialogBody', DialogBody);
    }
  };
});
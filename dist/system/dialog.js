System.register(['aurelia-templating'], function (_export) {
  'use strict';

  var customElement, Dialog;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaTemplating) {
      customElement = _aureliaTemplating.customElement;
    }],
    execute: function () {
      Dialog = (function () {
        function Dialog() {
          _classCallCheck(this, _Dialog);
        }

        var _Dialog = Dialog;
        Dialog = customElement('dialog')(Dialog) || Dialog;
        return Dialog;
      })();

      _export('Dialog', Dialog);
    }
  };
});
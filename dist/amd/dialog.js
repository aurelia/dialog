define(['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Dialog = (function () {
    function Dialog() {
      _classCallCheck(this, _Dialog);
    }

    var _Dialog = Dialog;
    Dialog = _aureliaTemplating.customElement('dialog')(Dialog) || Dialog;
    return Dialog;
  })();

  exports.Dialog = Dialog;
});
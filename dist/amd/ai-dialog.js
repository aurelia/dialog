define(['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var AiDialog = (function () {
    function AiDialog() {
      _classCallCheck(this, _AiDialog);
    }

    var _AiDialog = AiDialog;
    AiDialog = _aureliaTemplating.customElement('ai-dialog')(AiDialog) || AiDialog;
    return AiDialog;
  })();

  exports.AiDialog = AiDialog;
});
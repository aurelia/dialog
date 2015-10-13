'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaTemplating = require('aurelia-templating');

var AiDialogBody = (function () {
  function AiDialogBody() {
    _classCallCheck(this, _AiDialogBody);
  }

  var _AiDialogBody = AiDialogBody;
  AiDialogBody = _aureliaTemplating.customElement('ai-dialog-body')(AiDialogBody) || AiDialogBody;
  return AiDialogBody;
})();

exports.AiDialogBody = AiDialogBody;
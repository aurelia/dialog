define(['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var DialogBody = (function () {
    function DialogBody() {
      _classCallCheck(this, _DialogBody);
    }

    var _DialogBody = DialogBody;
    DialogBody = _aureliaTemplating.customElement('dialog-body')(DialogBody) || DialogBody;
    return DialogBody;
  })();

  exports.DialogBody = DialogBody;
});
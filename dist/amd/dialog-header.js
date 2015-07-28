define(['exports', 'aurelia-templating', './dialog-controller'], function (exports, _aureliaTemplating, _dialogController) {
  'use strict';

  exports.__esModule = true;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var DialogHeader = (function () {
    function DialogHeader(controller) {
      _classCallCheck(this, _DialogHeader);

      this.controller = controller;
    }

    var _DialogHeader = DialogHeader;

    _createClass(_DialogHeader, null, [{
      key: 'inject',
      value: [_dialogController.DialogController],
      enumerable: true
    }]);

    DialogHeader = _aureliaTemplating.customElement('dialog-header')(DialogHeader) || DialogHeader;
    return DialogHeader;
  })();

  exports.DialogHeader = DialogHeader;
});
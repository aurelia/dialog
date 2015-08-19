System.register(['aurelia-templating', './dialog-controller'], function (_export) {
  'use strict';

  var customElement, DialogController, DialogHeader;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaTemplating) {
      customElement = _aureliaTemplating.customElement;
    }, function (_dialogController) {
      DialogController = _dialogController.DialogController;
    }],
    execute: function () {
      DialogHeader = (function () {
        _createClass(DialogHeader, null, [{
          key: 'inject',
          value: [DialogController],
          enumerable: true
        }]);

        function DialogHeader(controller) {
          _classCallCheck(this, _DialogHeader);

          this.controller = controller;
        }

        var _DialogHeader = DialogHeader;
        DialogHeader = customElement('dialog-header')(DialogHeader) || DialogHeader;
        return DialogHeader;
      })();

      _export('DialogHeader', DialogHeader);
    }
  };
});
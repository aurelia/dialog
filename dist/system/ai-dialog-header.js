System.register(['aurelia-templating', './dialog-controller'], function (_export) {
  'use strict';

  var customElement, DialogController, AiDialogHeader;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaTemplating) {
      customElement = _aureliaTemplating.customElement;
    }, function (_dialogController) {
      DialogController = _dialogController.DialogController;
    }],
    execute: function () {
      AiDialogHeader = (function () {
        _createClass(AiDialogHeader, null, [{
          key: 'inject',
          value: [DialogController],
          enumerable: true
        }]);

        function AiDialogHeader(controller) {
          _classCallCheck(this, _AiDialogHeader);

          this.controller = controller;
        }

        var _AiDialogHeader = AiDialogHeader;
        AiDialogHeader = customElement('ai-dialog-header')(AiDialogHeader) || AiDialogHeader;
        return AiDialogHeader;
      })();

      _export('AiDialogHeader', AiDialogHeader);
    }
  };
});
define(['exports', './dialog', './dialog-header', './dialog-body', './dialog-footer', './attach-focus', './dialog-service', './dialog-controller'], function (exports, _dialog, _dialogHeader, _dialogBody, _dialogFooter, _attachFocus, _dialogService, _dialogController) {
  'use strict';

  exports.__esModule = true;
  exports.configure = configure;

  function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

  function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

  exports.Dialog = _dialog.Dialog;
  exports.DialogHeader = _dialogHeader.DialogHeader;
  exports.DialogBody = _dialogBody.DialogBody;
  exports.DialogFooter = _dialogFooter.DialogFooter;
  exports.AttachFocus = _attachFocus.AttachFocus;

  function configure(config) {
    config.globalResources('./dialog', './dialog-header', './dialog-body', './dialog-footer', './attach-focus');
  }

  _defaults(exports, _interopExportWildcard(_dialogService, _defaults));

  _defaults(exports, _interopExportWildcard(_dialogController, _defaults));
});
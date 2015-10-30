define(['exports', './dialog-renderer', './ai-dialog', './ai-dialog-header', './ai-dialog-body', './ai-dialog-footer', './attach-focus', './dialog-service', './dialog-controller'], function (exports, _dialogRenderer, _aiDialog, _aiDialogHeader, _aiDialogBody, _aiDialogFooter, _attachFocus, _dialogService, _dialogController) {
  'use strict';

  exports.__esModule = true;
  exports.configure = configure;

  function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

  function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

  exports.AiDialog = _aiDialog.AiDialog;
  exports.AiDialogHeader = _aiDialogHeader.AiDialogHeader;
  exports.AiDialogBody = _aiDialogBody.AiDialogBody;
  exports.AiDialogFooter = _aiDialogFooter.AiDialogFooter;
  exports.AttachFocus = _attachFocus.AttachFocus;

  function configure(config, callback) {
    config.globalResources('./ai-dialog', './ai-dialog-header', './ai-dialog-body', './ai-dialog-footer', './attach-focus');
    if (typeof callback === 'function') {
      callback(_dialogRenderer.globalSettings);
    }
  }

  _defaults(exports, _interopExportWildcard(_dialogService, _defaults));

  _defaults(exports, _interopExportWildcard(_dialogController, _defaults));
});
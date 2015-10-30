System.register(['./dialog-renderer', './ai-dialog', './ai-dialog-header', './ai-dialog-body', './ai-dialog-footer', './attach-focus', './dialog-service', './dialog-controller'], function (_export) {
  'use strict';

  var globalSettings;

  _export('configure', configure);

  function configure(config, callback) {
    config.globalResources('./ai-dialog', './ai-dialog-header', './ai-dialog-body', './ai-dialog-footer', './attach-focus');
    if (typeof callback === 'function') {
      callback(globalSettings);
    }
  }

  return {
    setters: [function (_dialogRenderer) {
      globalSettings = _dialogRenderer.globalSettings;
    }, function (_aiDialog) {
      _export('AiDialog', _aiDialog.AiDialog);
    }, function (_aiDialogHeader) {
      _export('AiDialogHeader', _aiDialogHeader.AiDialogHeader);
    }, function (_aiDialogBody) {
      _export('AiDialogBody', _aiDialogBody.AiDialogBody);
    }, function (_aiDialogFooter) {
      _export('AiDialogFooter', _aiDialogFooter.AiDialogFooter);
    }, function (_attachFocus) {
      _export('AttachFocus', _attachFocus.AttachFocus);
    }, function (_dialogService) {
      for (var _key in _dialogService) {
        if (_key !== 'default') _export(_key, _dialogService[_key]);
      }
    }, function (_dialogController) {
      for (var _key2 in _dialogController) {
        if (_key2 !== 'default') _export(_key2, _dialogController[_key2]);
      }
    }],
    execute: function () {}
  };
});
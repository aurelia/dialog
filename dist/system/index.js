System.register(['./dialog', './dialog-header', './dialog-body', './dialog-footer', './attach-focus', './dialog-service', './dialog-controller'], function (_export) {
  'use strict';

  _export('configure', configure);

  function configure(config) {
    config.globalResources('./dialog', './dialog-header', './dialog-body', './dialog-footer', './attach-focus');
  }

  return {
    setters: [function (_dialog) {
      _export('Dialog', _dialog.Dialog);
    }, function (_dialogHeader) {
      _export('DialogHeader', _dialogHeader.DialogHeader);
    }, function (_dialogBody) {
      _export('DialogBody', _dialogBody.DialogBody);
    }, function (_dialogFooter) {
      _export('DialogFooter', _dialogFooter.DialogFooter);
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
System.register(['./dialog-service', './dialog-controller', './examples/prompt'], function (_export) {
  'use strict';

  _export('configure', configure);

  function configure(config) {
    config.globalResources('./dialog', './dialog-header', './dialog-body', './dialog-footer', './attach-focus', './examples/prompt');
  }

  return {
    setters: [function (_dialogService) {
      for (var _key in _dialogService) {
        _export(_key, _dialogService[_key]);
      }
    }, function (_dialogController) {
      for (var _key2 in _dialogController) {
        _export(_key2, _dialogController[_key2]);
      }
    }, function (_examplesPrompt) {
      for (var _key3 in _examplesPrompt) {
        _export(_key3, _examplesPrompt[_key3]);
      }
    }],
    execute: function () {}
  };
});
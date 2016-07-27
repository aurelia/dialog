'use strict';

System.register(['./dialog-configuration', './ai-dialog', './ai-dialog-header', './ai-dialog-body', './ai-dialog-footer', './attach-focus', './dialog-service', './dialog-controller', './dialog-result'], function (_export, _context) {
  "use strict";

  var DialogConfiguration;
  function configure(aurelia, callback) {
    var config = new DialogConfiguration(aurelia);

    if (typeof callback === 'function') {
      callback(config);
    } else {
      config.useDefaults();
    }

    config._apply();
  }

  _export('configure', configure);

  return {
    setters: [function (_dialogConfiguration) {
      DialogConfiguration = _dialogConfiguration.DialogConfiguration;
      var _exportObj = {};
      _exportObj.DialogConfiguration = _dialogConfiguration.DialogConfiguration;

      _export(_exportObj);
    }, function (_aiDialog) {
      var _exportObj2 = {};
      _exportObj2.AiDialog = _aiDialog.AiDialog;

      _export(_exportObj2);
    }, function (_aiDialogHeader) {
      var _exportObj3 = {};
      _exportObj3.AiDialogHeader = _aiDialogHeader.AiDialogHeader;

      _export(_exportObj3);
    }, function (_aiDialogBody) {
      var _exportObj4 = {};
      _exportObj4.AiDialogBody = _aiDialogBody.AiDialogBody;

      _export(_exportObj4);
    }, function (_aiDialogFooter) {
      var _exportObj5 = {};
      _exportObj5.AiDialogFooter = _aiDialogFooter.AiDialogFooter;

      _export(_exportObj5);
    }, function (_attachFocus) {
      var _exportObj6 = {};
      _exportObj6.AttachFocus = _attachFocus.AttachFocus;

      _export(_exportObj6);
    }, function (_dialogService) {
      var _exportObj7 = {};
      _exportObj7.DialogService = _dialogService.DialogService;

      _export(_exportObj7);
    }, function (_dialogController) {
      var _exportObj8 = {};
      _exportObj8.DialogController = _dialogController.DialogController;

      _export(_exportObj8);
    }, function (_dialogResult) {
      var _exportObj9 = {};
      _exportObj9.DialogResult = _dialogResult.DialogResult;

      _export(_exportObj9);
    }],
    execute: function () {}
  };
});
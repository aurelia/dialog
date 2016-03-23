'use strict';

System.register(['./dialog-configuration', './resources/ai-dialog', './resources/ai-dialog-header', './resources/ai-dialog-body', './resources/ai-dialog-footer', './resources/attach-focus', './dialog-service', './dialog-controller'], function (_export, _context) {
  var DialogConfiguration;
  return {
    setters: [function (_dialogConfiguration) {
      DialogConfiguration = _dialogConfiguration.DialogConfiguration;
      var _exportObj = {};
      _exportObj.DialogConfiguration = _dialogConfiguration.DialogConfiguration;

      _export(_exportObj);
    }, function (_resourcesAiDialog) {
      var _exportObj2 = {};
      _exportObj2.AiDialog = _resourcesAiDialog.AiDialog;

      _export(_exportObj2);
    }, function (_resourcesAiDialogHeader) {
      var _exportObj3 = {};
      _exportObj3.AiDialogHeader = _resourcesAiDialogHeader.AiDialogHeader;

      _export(_exportObj3);
    }, function (_resourcesAiDialogBody) {
      var _exportObj4 = {};
      _exportObj4.AiDialogBody = _resourcesAiDialogBody.AiDialogBody;

      _export(_exportObj4);
    }, function (_resourcesAiDialogFooter) {
      var _exportObj5 = {};
      _exportObj5.AiDialogFooter = _resourcesAiDialogFooter.AiDialogFooter;

      _export(_exportObj5);
    }, function (_resourcesAttachFocus) {
      var _exportObj6 = {};
      _exportObj6.AttachFocus = _resourcesAttachFocus.AttachFocus;

      _export(_exportObj6);
    }, function (_dialogService) {
      var _exportObj7 = {};
      _exportObj7.DialogService = _dialogService.DialogService;

      _export(_exportObj7);
    }, function (_dialogController) {
      var _exportObj8 = {};
      _exportObj8.DialogController = _dialogController.DialogController;
      _exportObj8.DialogResult = _dialogController.DialogResult;

      _export(_exportObj8);
    }],
    execute: function () {
      function configure(aurelia, callback) {
        var config = new DialogConfiguration(aurelia);

        if (typeof callback === 'function') {
          callback(config);
          return;
        }

        config.useDefaults();
      }

      _export('configure', configure);
    }
  };
});
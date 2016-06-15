define(['exports', './ai-dialog', './ai-dialog-header', './ai-dialog-body', './ai-dialog-footer', './attach-focus', './dialog-configuration', './dialog-service', './dialog-controller', './dialog-result'], function (exports, _aiDialog, _aiDialogHeader, _aiDialogBody, _aiDialogFooter, _attachFocus, _dialogConfiguration, _dialogService, _dialogController, _dialogResult) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogResult = exports.DialogController = exports.DialogService = exports.DialogConfiguration = exports.AttachFocus = exports.AiDialogFooter = exports.AiDialogBody = exports.AiDialogHeader = exports.AiDialog = undefined;
  Object.defineProperty(exports, 'AiDialog', {
    enumerable: true,
    get: function () {
      return _aiDialog.AiDialog;
    }
  });
  Object.defineProperty(exports, 'AiDialogHeader', {
    enumerable: true,
    get: function () {
      return _aiDialogHeader.AiDialogHeader;
    }
  });
  Object.defineProperty(exports, 'AiDialogBody', {
    enumerable: true,
    get: function () {
      return _aiDialogBody.AiDialogBody;
    }
  });
  Object.defineProperty(exports, 'AiDialogFooter', {
    enumerable: true,
    get: function () {
      return _aiDialogFooter.AiDialogFooter;
    }
  });
  Object.defineProperty(exports, 'AttachFocus', {
    enumerable: true,
    get: function () {
      return _attachFocus.AttachFocus;
    }
  });
  exports.configure = configure;
  Object.defineProperty(exports, 'DialogConfiguration', {
    enumerable: true,
    get: function () {
      return _dialogConfiguration.DialogConfiguration;
    }
  });
  Object.defineProperty(exports, 'DialogService', {
    enumerable: true,
    get: function () {
      return _dialogService.DialogService;
    }
  });
  Object.defineProperty(exports, 'DialogController', {
    enumerable: true,
    get: function () {
      return _dialogController.DialogController;
    }
  });
  Object.defineProperty(exports, 'DialogResult', {
    enumerable: true,
    get: function () {
      return _dialogResult.DialogResult;
    }
  });
  function configure(aurelia, callback) {
    var config = new _dialogConfiguration.DialogConfiguration(aurelia);

    if (typeof callback === 'function') {
      callback(config);
    } else {
      config.useDefaults();
    }

    config._apply();
  }
});
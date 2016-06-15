'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DialogResult = exports.DialogController = exports.DialogService = exports.DialogConfiguration = exports.AttachFocus = exports.AiDialogFooter = exports.AiDialogBody = exports.AiDialogHeader = exports.AiDialog = undefined;

var _aiDialog = require('./ai-dialog');

Object.defineProperty(exports, 'AiDialog', {
  enumerable: true,
  get: function get() {
    return _aiDialog.AiDialog;
  }
});

var _aiDialogHeader = require('./ai-dialog-header');

Object.defineProperty(exports, 'AiDialogHeader', {
  enumerable: true,
  get: function get() {
    return _aiDialogHeader.AiDialogHeader;
  }
});

var _aiDialogBody = require('./ai-dialog-body');

Object.defineProperty(exports, 'AiDialogBody', {
  enumerable: true,
  get: function get() {
    return _aiDialogBody.AiDialogBody;
  }
});

var _aiDialogFooter = require('./ai-dialog-footer');

Object.defineProperty(exports, 'AiDialogFooter', {
  enumerable: true,
  get: function get() {
    return _aiDialogFooter.AiDialogFooter;
  }
});

var _attachFocus = require('./attach-focus');

Object.defineProperty(exports, 'AttachFocus', {
  enumerable: true,
  get: function get() {
    return _attachFocus.AttachFocus;
  }
});
exports.configure = configure;

var _dialogConfiguration = require('./dialog-configuration');

Object.defineProperty(exports, 'DialogConfiguration', {
  enumerable: true,
  get: function get() {
    return _dialogConfiguration.DialogConfiguration;
  }
});

var _dialogService = require('./dialog-service');

Object.defineProperty(exports, 'DialogService', {
  enumerable: true,
  get: function get() {
    return _dialogService.DialogService;
  }
});

var _dialogController = require('./dialog-controller');

Object.defineProperty(exports, 'DialogController', {
  enumerable: true,
  get: function get() {
    return _dialogController.DialogController;
  }
});

var _dialogResult = require('./dialog-result');

Object.defineProperty(exports, 'DialogResult', {
  enumerable: true,
  get: function get() {
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
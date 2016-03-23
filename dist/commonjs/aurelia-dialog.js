'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DialogResult = exports.DialogController = exports.DialogService = exports.DialogConfiguration = exports.AttachFocus = exports.AiDialogFooter = exports.AiDialogBody = exports.AiDialogHeader = exports.AiDialog = undefined;

var _aiDialog = require('./resources/ai-dialog');

Object.defineProperty(exports, 'AiDialog', {
  enumerable: true,
  get: function get() {
    return _aiDialog.AiDialog;
  }
});

var _aiDialogHeader = require('./resources/ai-dialog-header');

Object.defineProperty(exports, 'AiDialogHeader', {
  enumerable: true,
  get: function get() {
    return _aiDialogHeader.AiDialogHeader;
  }
});

var _aiDialogBody = require('./resources/ai-dialog-body');

Object.defineProperty(exports, 'AiDialogBody', {
  enumerable: true,
  get: function get() {
    return _aiDialogBody.AiDialogBody;
  }
});

var _aiDialogFooter = require('./resources/ai-dialog-footer');

Object.defineProperty(exports, 'AiDialogFooter', {
  enumerable: true,
  get: function get() {
    return _aiDialogFooter.AiDialogFooter;
  }
});

var _attachFocus = require('./resources/attach-focus');

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
Object.defineProperty(exports, 'DialogResult', {
  enumerable: true,
  get: function get() {
    return _dialogController.DialogResult;
  }
});
function configure(aurelia, callback) {
  var config = new _dialogConfiguration.DialogConfiguration(aurelia);

  if (typeof callback === 'function') {
    callback(config);
    return;
  }

  config.useDefaults();
}
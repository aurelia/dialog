'use strict';

exports.__esModule = true;
exports.configure = configure;

function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var _dialogRenderer = require('./dialog-renderer');

var _aiDialog = require('./ai-dialog');

exports.AiDialog = _aiDialog.AiDialog;

var _aiDialogHeader = require('./ai-dialog-header');

exports.AiDialogHeader = _aiDialogHeader.AiDialogHeader;

var _aiDialogBody = require('./ai-dialog-body');

exports.AiDialogBody = _aiDialogBody.AiDialogBody;

var _aiDialogFooter = require('./ai-dialog-footer');

exports.AiDialogFooter = _aiDialogFooter.AiDialogFooter;

var _attachFocus = require('./attach-focus');

exports.AttachFocus = _attachFocus.AttachFocus;

function configure(config, callback) {
  config.globalResources('./ai-dialog', './ai-dialog-header', './ai-dialog-body', './ai-dialog-footer', './attach-focus');
  if (typeof callback === 'function') {
    callback(_dialogRenderer.globalSettings);
  }
}

var _dialogService = require('./dialog-service');

_defaults(exports, _interopExportWildcard(_dialogService, _defaults));

var _dialogController = require('./dialog-controller');

_defaults(exports, _interopExportWildcard(_dialogController, _defaults));
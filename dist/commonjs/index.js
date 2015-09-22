'use strict';

exports.__esModule = true;
exports.configure = configure;

function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var _dialog = require('./dialog');

exports.Dialog = _dialog.Dialog;

var _dialogHeader = require('./dialog-header');

exports.DialogHeader = _dialogHeader.DialogHeader;

var _dialogBody = require('./dialog-body');

exports.DialogBody = _dialogBody.DialogBody;

var _dialogFooter = require('./dialog-footer');

exports.DialogFooter = _dialogFooter.DialogFooter;

var _attachFocus = require('./attach-focus');

exports.AttachFocus = _attachFocus.AttachFocus;

function configure(config) {
  config.globalResources('./dialog', './dialog-header', './dialog-body', './dialog-footer', './attach-focus');
}

var _dialogService = require('./dialog-service');

_defaults(exports, _interopExportWildcard(_dialogService, _defaults));

var _dialogController = require('./dialog-controller');

_defaults(exports, _interopExportWildcard(_dialogController, _defaults));
'use strict';

exports.__esModule = true;
exports.configure = configure;

function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function configure(config) {
  config.globalResources('./dialog', './dialog-header', './dialog-body', './dialog-footer', './attach-focus', './examples/prompt');
}

var _dialogService = require('./dialog-service');

_defaults(exports, _interopExportWildcard(_dialogService, _defaults));

var _dialogController = require('./dialog-controller');

_defaults(exports, _interopExportWildcard(_dialogController, _defaults));

var _examplesPrompt = require('./examples/prompt');

_defaults(exports, _interopExportWildcard(_examplesPrompt, _defaults));
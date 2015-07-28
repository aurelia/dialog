define(['exports', './dialog-service', './dialog-controller', './examples/prompt'], function (exports, _dialogService, _dialogController, _examplesPrompt) {
  'use strict';

  exports.__esModule = true;
  exports.configure = configure;

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

  function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

  function configure(aurelia) {
    aurelia.globalizeResources('./dialog', './dialog-header', './dialog-body', './dialog-footer', './attach-focus', './examples/prompt');
  }

  _defaults(exports, _interopRequireWildcard(_dialogService));

  _defaults(exports, _interopRequireWildcard(_dialogController));

  _defaults(exports, _interopRequireWildcard(_examplesPrompt));
});
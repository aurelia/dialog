'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = configure;

var _dialogConfiguration = require('./dialog-configuration');

function configure(aurelia, callback) {
  var config = new _dialogConfiguration.DialogConfiguration(aurelia);

  if (typeof callback === 'function') {
    callback(config);
    return;
  }

  config.useDefaults();
}
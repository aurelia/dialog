define(['exports'], function (exports) {
  'use strict';

  exports.__esModule = true;
  exports.configure = configure;

  function configure(aurelia) {
    aurelia.globalizeResources('./dialog', './dialog-header', './dialog-body', './dialog-footer', './attach-focus');
  }
});
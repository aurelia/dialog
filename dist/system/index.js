System.register([], function (_export) {
  'use strict';

  _export('configure', configure);

  function configure(aurelia) {
    aurelia.globalizeResources('./dialog', './dialog-header', './dialog-body', './dialog-footer', './attach-focus');
  }

  return {
    setters: [],
    execute: function () {}
  };
});
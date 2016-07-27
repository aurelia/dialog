'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaDialog = require('./aurelia-dialog');

Object.keys(_aureliaDialog).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaDialog[key];
    }
  });
});
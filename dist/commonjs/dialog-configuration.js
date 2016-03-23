'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DialogConfiguration = undefined;

var _renderer = require('./renderers/renderer');

var _dialogRenderer = require('./renderers/dialog-renderer');

var _dialogOptions = require('./dialog-options');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultRenderer = _dialogRenderer.DialogRenderer;
var resources = {
  'ai-dialog': './resources/ai-dialog',
  'ai-dialog-header': './resources/ai-dialog-header',
  'ai-dialog-body': './resources/ai-dialog-body',
  'ai-dialog-footer': './resources/ai-dialog-footer',
  'attach-focus': './resources/attach-focus'
};

var DialogConfiguration = exports.DialogConfiguration = function () {
  function DialogConfiguration(aurelia) {
    _classCallCheck(this, DialogConfiguration);

    this.aurelia = aurelia;
    this.settings = _dialogOptions.dialogOptions;
  }

  DialogConfiguration.prototype.useDefaults = function useDefaults() {
    return this.useRenderer(defaultRenderer).useResource('ai-dialog').useResource('ai-dialog-header').useResource('ai-dialog-body').useResource('ai-dialog-footer').useResource('attach-focus');
  };

  DialogConfiguration.prototype.useResource = function useResource(resourceName) {
    this.aurelia.globalResources(resources[resourceName]);
    return this;
  };

  DialogConfiguration.prototype.useRenderer = function useRenderer(renderer, settings) {
    this.aurelia.singleton(_renderer.Renderer, renderer);
    this.settings = Object.assign(_dialogOptions.dialogOptions, settings);
    return this;
  };

  return DialogConfiguration;
}();
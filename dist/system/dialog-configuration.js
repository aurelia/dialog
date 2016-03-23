'use strict';

System.register(['./renderers/renderer', './renderers/dialog-renderer', './dialog-options'], function (_export, _context) {
  var Renderer, DialogRenderer, dialogOptions, defaultRenderer, resources, DialogConfiguration;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_renderersRenderer) {
      Renderer = _renderersRenderer.Renderer;
    }, function (_renderersDialogRenderer) {
      DialogRenderer = _renderersDialogRenderer.DialogRenderer;
    }, function (_dialogOptions) {
      dialogOptions = _dialogOptions.dialogOptions;
    }],
    execute: function () {
      defaultRenderer = DialogRenderer;
      resources = {
        'ai-dialog': './resources/ai-dialog',
        'ai-dialog-header': './resources/ai-dialog-header',
        'ai-dialog-body': './resources/ai-dialog-body',
        'ai-dialog-footer': './resources/ai-dialog-footer',
        'attach-focus': './resources/attach-focus'
      };

      _export('DialogConfiguration', DialogConfiguration = function () {
        function DialogConfiguration(aurelia) {
          _classCallCheck(this, DialogConfiguration);

          this.aurelia = aurelia;
          this.settings = dialogOptions;
        }

        DialogConfiguration.prototype.useDefaults = function useDefaults() {
          return this.useRenderer(defaultRenderer).useResource('ai-dialog').useResource('ai-dialog-header').useResource('ai-dialog-body').useResource('ai-dialog-footer').useResource('attach-focus');
        };

        DialogConfiguration.prototype.useResource = function useResource(resourceName) {
          this.aurelia.globalResources(resources[resourceName]);
          return this;
        };

        DialogConfiguration.prototype.useRenderer = function useRenderer(renderer, settings) {
          this.aurelia.singleton(Renderer, renderer);
          this.settings = Object.assign(dialogOptions, settings);
          return this;
        };

        return DialogConfiguration;
      }());

      _export('DialogConfiguration', DialogConfiguration);
    }
  };
});
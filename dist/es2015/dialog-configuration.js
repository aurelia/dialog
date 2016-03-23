import { Renderer } from './renderers/renderer';
import { DialogRenderer } from './renderers/dialog-renderer';
import { dialogOptions } from './dialog-options';

let defaultRenderer = DialogRenderer;
let resources = {
  'ai-dialog': './resources/ai-dialog',
  'ai-dialog-header': './resources/ai-dialog-header',
  'ai-dialog-body': './resources/ai-dialog-body',
  'ai-dialog-footer': './resources/ai-dialog-footer',
  'attach-focus': './resources/attach-focus'
};

export let DialogConfiguration = class DialogConfiguration {
  constructor(aurelia) {
    this.aurelia = aurelia;
    this.settings = dialogOptions;
  }

  useDefaults() {
    return this.useRenderer(defaultRenderer).useResource('ai-dialog').useResource('ai-dialog-header').useResource('ai-dialog-body').useResource('ai-dialog-footer').useResource('attach-focus');
  }

  useResource(resourceName) {
    this.aurelia.globalResources(resources[resourceName]);
    return this;
  }

  useRenderer(renderer, settings) {
    this.aurelia.singleton(Renderer, renderer);
    this.settings = Object.assign(dialogOptions, settings);
    return this;
  }
};
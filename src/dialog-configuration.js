import {Renderer} from './renderers/renderer';
import {DialogRenderer} from './renderers/dialog-renderer';
import {dialogOptions} from './dialog-options';

let defaultRenderer = DialogRenderer;
let resources = {
  'ai-dialog': './resources/ai-dialog',
  'ai-dialog-header': './resources/ai-dialog-header',
  'ai-dialog-body': './resources/ai-dialog-body',
  'ai-dialog-footer': './resources/ai-dialog-footer',
  'attach-focus': './resources/attach-focus'
};

/**
 * A configuration builder for the dialog plugin.
 * @constructor
 */
export class DialogConfiguration {
  constructor(aurelia) {
    this.aurelia = aurelia;
    this.settings = dialogOptions;
  }

  /**
   * Selects the Aurelia conventional defaults for the dialog plugin.
   * @chainable
   */
  useDefaults(): DialogConfiguration {
    return this.useRenderer(defaultRenderer)
      .useResource('ai-dialog')
      .useResource('ai-dialog-header')
      .useResource('ai-dialog-body')
      .useResource('ai-dialog-footer')
      .useResource('attach-focus');
  }

  /**
   * Exports the chosen dialog element or view to Aurelia's global resources.
   * @param resourceName The name of the dialog resource to export.
   * @chainable
   */
  useResource(resourceName: string): DialogConfiguration {
    this.aurelia.globalResources(resources[resourceName]);
    return this;
  }

  /**
   * Configures the plugin to use a specific dialog renderer.
   * @param renderer An object with a Renderer interface.
   * @param settings Global settings for the renderer.
   * @chainable
   */
  useRenderer(renderer: Renderer, settings?: Object): DialogConfiguration {
    this.aurelia.singleton(Renderer, renderer);
    this.settings = Object.assign(dialogOptions, settings);
    return this;
  }
}

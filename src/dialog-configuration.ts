import { FrameworkConfiguration } from 'aurelia-framework';
import { Renderer, RendererStatic } from './renderer';
import { DialogSettings, DefaultDialogSettings } from './dialog-settings';
import { DialogRenderer } from './dialog-renderer';
import { DOM } from 'aurelia-pal';

const defaultRenderer: RendererStatic = DialogRenderer;

const resources: { [key: string]: string } = {
  'ai-dialog': './ai-dialog',
  'ai-dialog-header': './ai-dialog-header',
  'ai-dialog-body': './ai-dialog-body',
  'ai-dialog-footer': './ai-dialog-footer',
  'attach-focus': './attach-focus'
};

// tslint:disable-next-line:max-line-length
export type DialogResourceName = 'ai-dialog' | 'ai-dialog-header' | 'ai-dialog-body' | 'ai-dialog-footer' | 'attach-focus';

// tslint:disable-next-line:max-line-length
const defaultCSSText = `ai-dialog-container,ai-dialog-overlay{position:fixed;top:0;right:0;bottom:0;left:0}ai-dialog-overlay{opacity:0}ai-dialog-overlay.active{opacity:1}ai-dialog-container{display:block;transition:opacity .2s linear;opacity:0;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch}ai-dialog-container.active{opacity:1}ai-dialog-container>div{padding:30px}ai-dialog-container>div>div{display:block;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto}ai-dialog-container,ai-dialog-container>div,ai-dialog-container>div>div{outline:0}ai-dialog{display:table;box-shadow:0 5px 15px rgba(0,0,0,.5);border:1px solid rgba(0,0,0,.2);border-radius:5px;padding:3;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial;background:#fff}ai-dialog>ai-dialog-header{display:block;padding:16px;border-bottom:1px solid #e5e5e5}ai-dialog>ai-dialog-header>button{float:right;border:none;display:block;width:32px;height:32px;background:0 0;font-size:22px;line-height:16px;margin:-14px -16px 0 0;padding:0;cursor:pointer}ai-dialog>ai-dialog-body{display:block;padding:16px}ai-dialog>ai-dialog-footer{display:block;padding:6px;border-top:1px solid #e5e5e5;text-align:right}ai-dialog>ai-dialog-footer button{color:#333;background-color:#fff;padding:6px 12px;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;background-image:none;border:1px solid #ccc;border-radius:4px;margin:5px 0 5px 5px}ai-dialog>ai-dialog-footer button:disabled{cursor:default;opacity:.45}ai-dialog>ai-dialog-footer button:hover:enabled{color:#333;background-color:#e6e6e6;border-color:#adadad}.ai-dialog-open{overflow:hidden}`;

/**
 * A configuration builder for the dialog plugin.
 */
export class DialogConfiguration {
  private fwConfig: FrameworkConfiguration;
  private renderer: RendererStatic;
  private cssText: string;
  private resources: string[] = [];

  /**
   * The configuration settings.
   */
  public settings: DialogSettings;

  constructor(frameworkConfiguration: FrameworkConfiguration, applySetter: (apply: () => void) => void) {
    this.fwConfig = frameworkConfiguration;
    this.settings = this.fwConfig.container.get(DefaultDialogSettings);
    applySetter(() => this._apply());
  }

  private _apply(): void {
    this.fwConfig.transient(Renderer, this.renderer);
    this.resources.forEach(resourceName => this.fwConfig.globalResources(resources[resourceName]));

    if (this.cssText) {
      DOM.injectStyles(this.cssText);
    }
  }

  /**
   * Selects the Aurelia conventional defaults for the dialog plugin.
   * @return This instance.
   */
  public useDefaults(): this {
    return this.useRenderer(defaultRenderer)
      .useCSS(defaultCSSText)
      .useStandardResources();
  }

  /**
   * Exports the standard set of dialog behaviors to Aurelia's global resources.
   * @return This instance.
   */
  public useStandardResources(): this {
    return this.useResource('ai-dialog')
      .useResource('ai-dialog-header')
      .useResource('ai-dialog-body')
      .useResource('ai-dialog-footer')
      .useResource('attach-focus');
  }

  /**
   * Exports the chosen dialog element or view to Aurelia's global resources.
   * @param resourceName The name of the dialog resource to export.
   * @return This instance.
   */
  public useResource(resourceName: DialogResourceName): this {
    this.resources.push(resourceName);
    return this;
  }

  /**
   * Configures the plugin to use a specific dialog renderer.
   * @param renderer A type that implements the Renderer interface.
   * @param settings Global settings for the renderer.
   * @return This instance.
   */
  public useRenderer(renderer: RendererStatic, settings?: DialogSettings): this {
    this.renderer = renderer;
    if (settings) {
      Object.assign(this.settings, settings);
    }
    return this;
  }

  /**
   * Configures the plugin to use specific css.
   * @param cssText The css to use in place of the default styles.
   * @return This instance.
   */
  public useCSS(cssText: string): this {
    this.cssText = cssText;
    return this;
  }
}

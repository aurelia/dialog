import { FrameworkConfiguration } from 'aurelia-framework';
import { Renderer, RendererStatic } from './renderer';
import { DialogSettings, DefaultDialogSettings } from './dialog-settings';
import { DialogRenderer } from './dialog-renderer';
import { DOM, PLATFORM } from 'aurelia-pal';

const defaultRenderer: RendererStatic = DialogRenderer;

const resources: { [key: string]: string } = {
  'ux-dialog': PLATFORM.moduleName('./ux-dialog'),
  'ux-dialog-header': PLATFORM.moduleName('./ux-dialog-header'),
  'ux-dialog-body': PLATFORM.moduleName('./ux-dialog-body'),
  'ux-dialog-footer': PLATFORM.moduleName('./ux-dialog-footer'),
  'attach-focus': PLATFORM.moduleName('./attach-focus')
};

// tslint:disable-next-line:max-line-length
export type DialogResourceName = 'ux-dialog' | 'ux-dialog-header' | 'ux-dialog-body' | 'ux-dialog-footer' | 'attach-focus';

// tslint:disable-next-line:max-line-length
const defaultCSSText = `ux-dialog-container,ux-dialog-overlay{position:fixed;top:0;right:0;bottom:0;left:0}ux-dialog-overlay{opacity:0}ux-dialog-overlay.active{opacity:1}ux-dialog-container{display:block;transition:opacity .2s linear;opacity:0;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch}ux-dialog-container.active{opacity:1}ux-dialog-container>div{padding:30px}ux-dialog-container>div>div{display:block;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto}ux-dialog-container,ux-dialog-container>div,ux-dialog-container>div>div{outline:0}ux-dialog{display:table;box-shadow:0 5px 15px rgba(0,0,0,.5);border:1px solid rgba(0,0,0,.2);border-radius:5px;padding:3px;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial;background:#fff}ux-dialog>ux-dialog-header{display:block;padding:16px;border-bottom:1px solid #e5e5e5}ux-dialog>ux-dialog-header>button{float:right;border:none;display:block;width:32px;height:32px;background:0 0;font-size:22px;line-height:16px;margin:-14px -16px 0 0;padding:0;cursor:pointer}ux-dialog>ux-dialog-body{display:block;padding:16px}ux-dialog>ux-dialog-footer{display:block;padding:6px;border-top:1px solid #e5e5e5;text-align:right}ux-dialog>ux-dialog-footer button{color:#333;background-color:#fff;padding:6px 12px;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;background-image:none;border:1px solid #ccc;border-radius:4px;margin:5px 0 5px 5px}ux-dialog>ux-dialog-footer button:disabled{cursor:default;opacity:.45}ux-dialog>ux-dialog-footer button:hover:enabled{color:#333;background-color:#e6e6e6;border-color:#adadad}.ux-dialog-open{overflow:hidden}`;

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
    return this.useResource('ux-dialog')
      .useResource('ux-dialog-header')
      .useResource('ux-dialog-body')
      .useResource('ux-dialog-footer')
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

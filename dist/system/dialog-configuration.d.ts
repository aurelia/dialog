import { FrameworkConfiguration } from 'aurelia-framework';
import { RendererStatic } from './renderer';
import { DialogSettings } from './dialog-settings';
export declare type DialogResourceName = 'ux-dialog' | 'ux-dialog-header' | 'ux-dialog-body' | 'ux-dialog-footer' | 'attach-focus';
/**
 * A configuration builder for the dialog plugin.
 */
export declare class DialogConfiguration {
    private fwConfig;
    private renderer;
    private cssText;
    private resources;
    /**
     * The global configuration settings.
     */
    settings: DialogSettings;
    constructor(frameworkConfiguration: FrameworkConfiguration, applySetter: (apply: () => void) => void);
    private _apply();
    /**
     * Selects the Aurelia conventional defaults for the dialog plugin.
     * @return This instance.
     */
    useDefaults(): this;
    /**
     * Exports the standard set of dialog behaviors to Aurelia's global resources.
     * @return This instance.
     */
    useStandardResources(): this;
    /**
     * Exports the chosen dialog element or view to Aurelia's global resources.
     * @param resourceName The name of the dialog resource to export.
     * @return This instance.
     */
    useResource(resourceName: DialogResourceName): this;
    /**
     * Configures the plugin to use a specific dialog renderer.
     * @param renderer A type that implements the Renderer interface.
     * @param settings Global settings for the renderer.
     * @return This instance.
     */
    useRenderer(renderer: RendererStatic, settings?: DialogSettings): this;
    /**
     * Configures the plugin to use specific css. You can pass an empty string to clear any set css.
     * @param cssText The css to use in place of the default styles.
     * @return This instance.
     */
    useCSS(cssText: string): this;
}

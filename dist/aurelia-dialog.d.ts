import {
  DOM
} from 'aurelia-pal';
import {
  transient,
  Container
} from 'aurelia-dependency-injection';
import {
  customAttribute,
  customElement,
  inlineView,
  bindable,
  CompositionEngine,
  ViewSlot
} from 'aurelia-templating';
import {
  Origin
} from 'aurelia-metadata';
export declare class DialogRenderer {
  getDialogContainer(): any;
  showDialog(dialogController: DialogController): any;
  hideDialog(dialogController: DialogController): any;
}

/**
 * An abstract base class for implementors of the basic Renderer API.
 */
export declare class Renderer {
  
  /**
     * Gets an anchor for the ViewSlot to insert a view into.
     * @returns A DOM element.
     */
  getDialogContainer(): any;
  
  /**
     * Displays the dialog.
     * @returns Promise A promise that resolves when the dialog has been displayed.
     */
  showDialog(dialogController: DialogController): Promise<any>;
  
  /**
     * Hides the dialog.
     * @returns Promise A promise that resolves when the dialog has been hidden.
     */
  hideDialog(dialogController: DialogController): Promise<any>;
}

/**
 * Call a lifecycle method on a viewModel if it exists.
 * @function
 * @param instance The viewModel instance.
 * @param name The lifecycle method name.
 * @param model The model to pass to the lifecycle method.
 * @returns Promise The result of the lifecycle method.
 */
export declare function invokeLifecycle(instance: any, name: string, model: any): any;
export declare class AttachFocus {
  static inject: any;
  value: any;
  constructor(element?: any);
  attached(): any;
  valueChanged(newValue?: any): any;
}
export declare class AiDialog {

}
export declare class AiDialogBody {

}

/**
 * The result of a dialog open operation.
 */
export declare class DialogResult {
  
  /**
     * Indicates whether or not the dialog was cancelled.
     */
  wasCancelled: boolean;
  
  /**
     * The data returned from the dialog.
     */
  output: any;
  
  /**
     * Creates an instance of DialogResult (Used Internally)
     */
  constructor(cancelled: boolean, output: any);
}
export declare let dialogOptions: any;

/**
 * A controller object for a Dialog instance.
 */
export declare class DialogController {
  
  /**
     * The settings used by this controller.
     */
  settings: any;
  
  /**
     * Creates an instance of DialogController.
     */
  constructor(renderer: DialogRenderer, settings: any, resolve: Function, reject: Function);
  
  /**
     * Closes the dialog with a successful output.
     * @param output The returned success output.
     */
  ok(output?: any): Promise<DialogResult>;
  
  /**
     * Closes the dialog with a cancel output.
     * @param output The returned cancel output.
     */
  cancel(output?: any): Promise<DialogResult>;
  
  /**
     * Closes the dialog with an error result.
     * @param message An error message.
     * @returns Promise An empty promise object.
     */
  error(message: any): Promise<void>;
  
  /**
     * Closes the dialog.
     * @param ok Whether or not the user input signified success.
     * @param output The specified output.
     * @returns Promise An empty promise object.
     */
  close(ok: boolean, output?: any): Promise<DialogResult>;
}

/**
 * A configuration builder for the dialog plugin.
 */
export declare class DialogConfiguration {
  
  /**
     * The configuration settings.
     */
  settings: any;
  constructor(aurelia?: any);
  
  /**
     * Selects the Aurelia conventional defaults for the dialog plugin.
     * @return This instance.
     */
  useDefaults(): DialogConfiguration;
  
  /**
     * Exports the standard set of dialog behaviors to Aurelia's global resources.
     * @return This instance.
     */
  useStandardResources(): DialogConfiguration;
  
  /**
     * Exports the chosen dialog element or view to Aurelia's global resources.
     * @param resourceName The name of the dialog resource to export.
     * @return This instance.
     */
  useResource(resourceName: string): DialogConfiguration;
  
  /**
     * Configures the plugin to use a specific dialog renderer.
     * @param renderer A type that implements the Renderer interface.
     * @param settings Global settings for the renderer.
     * @return This instance.
     */
  useRenderer(renderer: Function, settings?: Object): DialogConfiguration;
  
  /**
     * Configures the plugin to use specific css.
     * @param cssText The css to use in place of the default styles.
     * @return This instance.
     */
  useCSS(cssText: string): DialogConfiguration;
}

/**
 * * View-model for footer of Dialog.
 * */
export declare class AiDialogFooter {
  static inject: any;
  buttons: any[];
  useDefaultButtons: boolean;
  constructor(controller: DialogController);
  close(buttonValue: string): any;
  useDefaultButtonsChanged(newValue: boolean): any;
  static isCancelButton(value: string): any;
}
export declare class AiDialogHeader {
  static inject: any;
  constructor(controller?: any);
}

/**
 * A service allowing for the creation of dialogs.
 */
export declare class DialogService {
  static inject: any;
  
  /**
     * The current dialog controllers
     */
  controllers: DialogController[];
  
  /**
     * Is there an active dialog
     */
  hasActiveDialog: boolean;
  constructor(container: Container, compositionEngine: CompositionEngine);
  
  /**
     * Opens a new dialog.
     * @param settings Dialog settings for this dialog instance.
     * @return Promise A promise that settles when the dialog is closed.
     */
  open(settings?: Object): Promise<DialogResult>;
  
  /**
     * Opens a new dialog.
     * @param settings Dialog settings for this dialog instance.
     * @return Promise A promise that settles when the dialog is opened.
     * Resolves to the controller of the dialog.
     */
  openAndYieldController(settings?: Object): Promise<DialogController>;
}
import { Controller } from 'aurelia-templating';
import { Renderer } from './renderer';
import { DialogCancelableOperationResult } from './dialog-result';
import { DialogSettings } from './dialog-settings';
/**
 * A controller object for a Dialog instance.
 */
export declare class DialogController {
    private resolve;
    private reject;
    /**
     * The settings used by this controller.
     */
    settings: DialogSettings;
    renderer: Renderer;
    controller: Controller;
    /**
     * Creates an instance of DialogController.
     */
    constructor(renderer: Renderer, settings: DialogSettings, resolve: (data?: any) => void, reject: (reason: any) => void);
    /**
     * Closes the dialog with a successful output.
     * @param output The returned success output.
     */
    ok(output?: any): Promise<DialogCancelableOperationResult>;
    /**
     * Closes the dialog with a cancel output.
     * @param output The returned cancel output.
     */
    cancel(output?: any): Promise<DialogCancelableOperationResult>;
    /**
     * Closes the dialog with an error output.
     * @param output A reason for closing with an error.
     * @returns Promise An empty promise object.
     */
    error(output: any): Promise<void>;
    /**
     * Closes the dialog.
     * @param ok Whether or not the user input signified success.
     * @param output The specified output.
     * @returns Promise An empty promise object.
     */
    close(ok: boolean, output?: any): Promise<DialogCancelableOperationResult>;
}

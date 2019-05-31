import { DialogController } from './dialog-controller';
export interface RendererStatic {
    new (): Renderer;
}
/**
 * An abstract base class for implementors of the basic Renderer API.
 */
export declare class Renderer {
    /**
     * Gets an anchor for the ViewSlot to insert a view into.
     * @returns A DOM element.
     */
    getDialogContainer(): Element;
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

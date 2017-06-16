/**
 * An abstract base class for implementors of the basic Renderer API.
 */
export class Renderer {
    /**
     * Gets an anchor for the ViewSlot to insert a view into.
     * @returns A DOM element.
     */
    getDialogContainer() {
        throw new Error('DialogRenderer must implement getDialogContainer().');
    }
    /**
     * Displays the dialog.
     * @returns Promise A promise that resolves when the dialog has been displayed.
     */
    showDialog(dialogController) {
        throw new Error('DialogRenderer must implement showDialog().');
    }
    /**
     * Hides the dialog.
     * @returns Promise A promise that resolves when the dialog has been hidden.
     */
    hideDialog(dialogController) {
        throw new Error('DialogRenderer must implement hideDialog().');
    }
}

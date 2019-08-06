import { DialogController } from './dialog-controller';
/**
 * The result that a dialog cancelable operation resolves to.
 */
export interface DialogCancelableOperationResult {
    wasCancelled: boolean;
}
/**
 * The result that a dialog operation resolves to when cancelled.
 */
export interface DialogCancelResult {
    wasCancelled: true;
}
/**
 * The result received when a dialog closes.
 */
export interface DialogCloseResult extends DialogCancelableOperationResult {
    /**
     * The provided close value.
     */
    output?: any;
}
/**
 * The result received when a dialog opens.
 */
export interface DialogOpenResult {
    wasCancelled: false;
    /**
     * The controller for the open dialog.
     */
    controller: DialogController;
    /**
     * Promise that settles when the dialog is closed.
     */
    closeResult: Promise<DialogCloseResult>;
}

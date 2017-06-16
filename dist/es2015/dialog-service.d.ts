import { Container } from 'aurelia-dependency-injection';
import { CompositionEngine } from 'aurelia-templating';
import { DialogOpenResult, DialogCloseResult, DialogCancelResult } from './dialog-result';
import { DialogSettings } from './dialog-settings';
import { DialogController } from './dialog-controller';
export declare type DialogCancellableOpenResult = DialogOpenResult | DialogCancelResult;
export interface DialogOpenPromise<T extends DialogCancellableOpenResult> extends Promise<T> {
    whenClosed(onfulfilled?: ((value: DialogCloseResult) => DialogCloseResult | PromiseLike<DialogCloseResult>) | undefined | null, onrejected?: ((reason: any) => DialogCloseResult | PromiseLike<DialogCloseResult>) | undefined | null): Promise<DialogCloseResult>;
    whenClosed<TResult>(onfulfilled: ((value: DialogCloseResult) => DialogCloseResult | PromiseLike<DialogCloseResult>) | undefined | null, onrejected: (reason: any) => TResult | PromiseLike<TResult>): Promise<DialogCloseResult | TResult>;
    whenClosed<TResult>(onfulfilled: (value: DialogCloseResult) => TResult | PromiseLike<TResult>, onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<TResult>;
    whenClosed<TResult1, TResult2>(onfulfilled: (value: DialogCloseResult) => TResult1 | PromiseLike<TResult1>, onrejected: (reason: any) => TResult2 | PromiseLike<TResult2>): Promise<TResult1 | TResult2>;
}
/**
 * A service allowing for the creation of dialogs.
 */
export declare class DialogService {
    private container;
    private compositionEngine;
    private defaultSettings;
    /**
     * The current dialog controllers
     */
    controllers: DialogController[];
    /**
     * Is there an open dialog
     */
    hasOpenDialog: boolean;
    hasActiveDialog: boolean;
    constructor(container: Container, compositionEngine: CompositionEngine, defaultSettings: DialogSettings);
    private validateSettings(settings);
    private createCompositionContext(childContainer, host, settings);
    private ensureViewModel(compositionContext);
    private _cancelOperation(rejectOnCancel);
    private composeAndShowDialog(compositionContext, dialogController);
    /**
     * Opens a new dialog.
     * @param settings Dialog settings for this dialog instance.
     * @return Promise A promise that settles when the dialog is closed.
     */
    open(settings: DialogSettings & {
        rejectOnCancel: true;
    }): DialogOpenPromise<DialogOpenResult>;
    open(settings?: DialogSettings & {
        rejectOnCancel?: false | boolean;
    }): DialogOpenPromise<DialogCancellableOpenResult>;
    /**
     * Closes all open dialogs at the time of invocation.
     * @return Promise<DialogController[]> All controllers whose close operation was cancelled.
     */
    closeAll(): Promise<DialogController[]>;
}

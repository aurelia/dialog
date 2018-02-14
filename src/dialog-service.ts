import { DialogCompositionEngine } from './dialog-composition-engine';
import { DialogOpenResult, DialogCloseResult, DialogCancelResult } from './dialog-result';
import { DialogSettings, DefaultDialogSettings } from './dialog-settings';
import { DialogController } from './dialog-controller';

export type DialogCancellableOpenResult = DialogOpenResult | DialogCancelResult;

/* tslint:disable:max-line-length */
export interface DialogOpenPromise<T extends DialogCancellableOpenResult> extends Promise<T> {
  whenClosed(onfulfilled?: ((value: DialogCloseResult) => DialogCloseResult | PromiseLike<DialogCloseResult>) | undefined | null, onrejected?: ((reason: any) => DialogCloseResult | PromiseLike<DialogCloseResult>) | undefined | null): Promise<DialogCloseResult>;
  whenClosed<TResult>(onfulfilled: ((value: DialogCloseResult) => DialogCloseResult | PromiseLike<DialogCloseResult>) | undefined | null, onrejected: (reason: any) => TResult | PromiseLike<TResult>): Promise<DialogCloseResult | TResult>;
  whenClosed<TResult>(onfulfilled: (value: DialogCloseResult) => TResult | PromiseLike<TResult>, onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<TResult>;
  whenClosed<TResult1, TResult2>(onfulfilled: (value: DialogCloseResult) => TResult1 | PromiseLike<TResult1>, onrejected: (reason: any) => TResult2 | PromiseLike<TResult2>): Promise<TResult1 | TResult2>;
}
/* tslint:enable:max-line-length */

function whenClosed(this: Promise<DialogCancellableOpenResult>, onfulfilled?: any, onrejected?: any) {
  return this.then<DialogCloseResult>(r => r.wasCancelled ? r : r.closeResult).then(onfulfilled, onrejected);
}
function asDialogOpenPromise<T extends DialogCancellableOpenResult>(promise: Promise<T>): DialogOpenPromise<T> {
  (promise as DialogOpenPromise<T>).whenClosed = whenClosed;
  return promise as DialogOpenPromise<T>;
}

/**
 * A service allowing for the creation of dialogs.
 */
export class DialogService {
  private dialogCompositionEngine: DialogCompositionEngine;
  private defaultSettings: DialogSettings;

  /**
   * The current dialog controllers
   */
  public controllers: DialogController[] = [];

  /**
   * Is there an open dialog
   */
  public hasOpenDialog: boolean = false;
  public hasActiveDialog: boolean = false;

  /**
   * @internal
   */
  // tslint:disable-next-line:member-ordering
  public static inject = [DialogCompositionEngine, DefaultDialogSettings];
  constructor(dialogCompositionEngine: DialogCompositionEngine, defaultSettings: DialogSettings) {
    this.dialogCompositionEngine = dialogCompositionEngine;
    this.defaultSettings = defaultSettings;
  }

  private validateSettings(settings: DialogSettings): void {
    if (!settings.viewModel && !settings.view) {
      throw new Error('Invalid Dialog Settings. You must provide "viewModel", "view" or both.');
    }
  }

  /**
   * @internal
   */
  public createSettings(settings: DialogSettings): DialogSettings {
    settings = Object.assign({}, this.defaultSettings, settings);
    if (typeof settings.keyboard !== 'boolean' && !settings.keyboard) {
      settings.keyboard = !settings.lock;
    }
    if (typeof settings.overlayDismiss !== 'boolean') {
      settings.overlayDismiss = !settings.lock;
    }
    Object.defineProperty(settings, 'rejectOnCancel', {
      writable: false,
      configurable: true,
      enumerable: true
    });
    this.validateSettings(settings);
    return settings;
  }

  /**
   * Opens a new dialog.
   * @param settings Dialog settings for this dialog instance.
   * @return Promise A promise that settles when the dialog is closed.
   */
  // tslint:disable:max-line-length
  public open(settings: DialogSettings & { rejectOnCancel: true }): DialogOpenPromise<DialogOpenResult>;
  public open(settings?: DialogSettings & { rejectOnCancel?: false | boolean }): DialogOpenPromise<DialogCancellableOpenResult>;
  public open(settings: DialogSettings = {}): DialogOpenPromise<DialogCancellableOpenResult> {
    // tslint:enable:max-line-length
    settings = this.createSettings(settings);
    const openResult = this.dialogCompositionEngine.compose(settings).then(result => {
      this.controllers.push(result.controller);
      this.hasActiveDialog = this.hasOpenDialog = !!this.controllers.length;
      result.closeResult.then(() => {
        removeController(this, result.controller);
      }, () => {
        removeController(this, result.controller);
      });
      return result;
    });

    if (settings.rejectOnCancel) {
      return asDialogOpenPromise(openResult);
    }

    return asDialogOpenPromise(openResult.catch(reason => {
      if (typeof reason.wasCancelled === 'boolean') {
        return { wasCancelled: true } as DialogCancelResult;
      }
      throw reason;
    }));
  }

  /**
   * Closes all open dialogs at the time of invocation.
   * @return Promise<DialogController[]> All controllers whose close operation was cancelled.
   */
  public closeAll(): Promise<DialogController[]> {
    return Promise.all(this.controllers.slice(0).map(controller => {
      if (!controller.settings.rejectOnCancel) {
        return controller.cancel().then(result => {
          if (result.wasCancelled) {
            return controller;
          }
          return null;
        });
      }
      return controller.cancel().then(() => null).catch<DialogController>(reason => {
        if (reason.wasCancelled) {
          return controller;
        }
        throw reason;
      });
    })).then(unclosedControllers => unclosedControllers.filter(unclosed => !!unclosed) as DialogController[]);
  }
}

function removeController(service: DialogService, dialogController: DialogController): void {
  const i = service.controllers.indexOf(dialogController);
  if (i !== -1) {
    service.controllers.splice(i, 1);
    service.hasActiveDialog = service.hasOpenDialog = !!service.controllers.length;
  }
}

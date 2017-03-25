import { Container } from 'aurelia-dependency-injection';
import { Origin } from 'aurelia-metadata';
import { CompositionEngine, Controller, ViewSlot, CompositionContext } from 'aurelia-templating';
import { DialogOpenResult, DialogCloseResult, DialogCancelResult } from './dialog-result';
import { DialogSettings, DefaultDialogSettings } from './dialog-settings';
import { createDialogCancelError } from './dialog-cancel-error';
import { invokeLifecycle } from './lifecycle';
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
  private container: Container;
  private compositionEngine: CompositionEngine;
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
  public static inject = [Container, CompositionEngine, DefaultDialogSettings];
  constructor(container: Container, compositionEngine: CompositionEngine, defaultSettings: DialogSettings) {
    this.container = container;
    this.compositionEngine = compositionEngine;
    this.defaultSettings = defaultSettings;
  }

  private validateSettings(settings: DialogSettings): void {
    if (!settings.viewModel && !settings.view) {
      throw new Error('Invalid Dialog Settings. You must provide "viewModel", "view" or both.');
    }
  }

  // tslint:disable-next-line:max-line-length
  private createCompositionContext(childContainer: Container, host: Element, settings: DialogSettings): (CompositionContext & { host: Element }) { // TODO: remove when templating typings fix is used
    return {
      container: childContainer.parent,
      childContainer,
      bindingContext: null,
      viewResources: null as any,
      model: settings.model,
      view: settings.view,
      viewModel: settings.viewModel,
      viewSlot: new ViewSlot(host, true),
      host
    };
  }

  private ensureViewModel(compositionContext: CompositionContext): Promise<CompositionContext> {
    if (typeof compositionContext.viewModel === 'function') {
      compositionContext.viewModel = Origin.get(compositionContext.viewModel).moduleId;
    }

    if (typeof compositionContext.viewModel === 'string') {
      return this.compositionEngine.ensureViewModel(compositionContext);
    }

    return Promise.resolve(compositionContext);
  }

  private _cancelOperation(rejectOnCancel: boolean): DialogCancelResult {
    if (!rejectOnCancel) {
      return { wasCancelled: true };
    }
    throw createDialogCancelError();
  }

  // tslint:disable-next-line:max-line-length
  private composeAndShowDialog(compositionContext: CompositionContext, dialogController: DialogController): Promise<void> {
    if (!compositionContext.viewModel) {
      // provide access to the dialog controller for view only dialogs
      compositionContext.bindingContext = { controller: dialogController };
    }
    return this.compositionEngine.compose(compositionContext).then<void>((controller: Controller) => {
      dialogController.controller = controller;
      return dialogController.renderer.showDialog(dialogController).then(() => {
        this.controllers.push(dialogController);
        this.hasActiveDialog = this.hasOpenDialog = !!this.controllers.length;
      }, reason => {
        if (controller.viewModel) {
          invokeLifecycle(controller.viewModel, 'deactivate');
        }
        return Promise.reject(reason);
      });
    });
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
    const childContainer = settings.childContainer || this.container.createChild();
    let resolveCloseResult: any;
    let rejectCloseResult: any;
    const closeResult: Promise<DialogCloseResult> = new Promise((resolve, reject) => {
      resolveCloseResult = resolve;
      rejectCloseResult = reject;
    });
    const dialogController =
      childContainer.invoke(DialogController, [settings, resolveCloseResult, rejectCloseResult]);
    childContainer.registerInstance(DialogController, dialogController);
    closeResult.then(() => {
      removeController(this, dialogController);
    }, () => {
      removeController(this, dialogController);
    });
    const compositionContext = this.createCompositionContext(
      childContainer,
      dialogController.renderer.getDialogContainer(),
      dialogController.settings
    );
    const openResult = this.ensureViewModel(compositionContext).then<boolean>(compositionContext => {
      if (!compositionContext.viewModel) { return true; }
      return invokeLifecycle(compositionContext.viewModel, 'canActivate', dialogController.settings.model);
    }).then<DialogCancellableOpenResult>(canActivate => {
      if (!canActivate) {
        return this._cancelOperation(dialogController.settings.rejectOnCancel as boolean);
      }
      // if activation granted, compose and show
      return this.composeAndShowDialog(compositionContext, dialogController)
        .then(() => ({ controller: dialogController, closeResult, wasCancelled: false } as DialogOpenResult));
    });

    return asDialogOpenPromise(openResult);
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
          return;
        });
      }
      return controller.cancel().then(() => { return; }).catch<DialogController>(reason => {
        if (reason.wasCancelled) {
          return controller;
        }
        return Promise.reject(reason);
      });
    })).then(unclosedControllers => unclosedControllers.filter(unclosed => !!unclosed));
  }
}

function removeController(service: DialogService, dialogController: DialogController): void {
  const i = service.controllers.indexOf(dialogController);
  if (i !== -1) {
    service.controllers.splice(i, 1);
    service.hasActiveDialog = service.hasOpenDialog = !!service.controllers.length;
  }
}

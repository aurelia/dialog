import {Container} from 'aurelia-dependency-injection';
import {Origin} from 'aurelia-metadata';
import {CompositionEngine, Controller, ViewSlot, CompositionContext} from 'aurelia-templating';
import {Renderer} from './renderer';
import {DialogOpenResult, DialogCloseResult, DialogCancelResult, DialogOperationResult} from './dialog-result';
import {DialogSettings, BaseDialogSettings, DefaultDialogSettings} from './dialog-settings';
import {DialogCancelError} from './dialog-cancel-error';
import {invokeLifecycle} from './lifecycle';
import {DialogController} from './dialog-controller';

/**
 * A service allowing for the creation of dialogs.
 */
export class DialogService {
  private container: Container;
  private compositionEngine: CompositionEngine;
  private defaultSettings: BaseDialogSettings;

  /**
   * The current dialog controllers
   */
  public controllers: DialogController[] = [];

  /**
   * Is there an open dialog
   */
  public hasOpenDialog: boolean = false;
  public hasActiveDialog: boolean = false;

  public static inject = [Container, CompositionEngine, DefaultDialogSettings];
  constructor(container: Container, compositionEngine: CompositionEngine, defaultSettings: BaseDialogSettings) {
    this.container = container;
    this.compositionEngine = compositionEngine;
    this.defaultSettings = defaultSettings;
  }

  private createSettings(settings: DialogSettings): BaseDialogSettings {
    const baseSettings = Object.assign({}, this.defaultSettings, settings);
    baseSettings.startingZIndex = this.defaultSettings.startingZIndex; // should be set only when configuring the plugin
    // TODO: add settings validation - early error 
    return baseSettings;
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

  private _ensureViewModel(compositionContext: CompositionContext): Promise<CompositionContext> {
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
    throw new DialogCancelError();
  }

  // tslint:disable-next-line:max-line-length
  private composeAndShowDialog(compositionContext: CompositionContext, dialogController: DialogController): Promise<void> {
    return this.compositionEngine.compose(compositionContext).then<void>((controller: Controller) => {
      dialogController.controller = controller;
      return dialogController.renderer.showDialog(dialogController).then(() => {
        this.controllers.push(dialogController);
        this.hasActiveDialog = this.hasOpenDialog = !!this.controllers.length;
      }, reason => {
        invokeLifecycle(controller.viewModel, 'deactivate');
        return Promise.reject(reason);
      });
    });
  }

  /**
   * Opens a new dialog.
   * @param settings Dialog settings for this dialog instance.
   * @return Promise A promise that settles when the dialog is closed.
   */
  /* tslint:disable:max-line-length */
  public open(settings: DialogSettings & { rejectOnCancel: true, yieldController: false }): Promise<DialogCloseResult>;
  public open(settings: DialogSettings & { rejectOnCancel: true, yieldController: true }): Promise<DialogOpenResult>;
  public open(settings: DialogSettings & { rejectOnCancel: true }): Promise<DialogOpenResult | DialogCloseResult>;
  public open(settings: DialogSettings & { rejectOnCancel?: false, yieldController: false }): Promise<DialogCloseResult | DialogCancelResult>;
  public open(settings: DialogSettings & { rejectOnCancel?: false, yieldController: true }): Promise<DialogOpenResult | DialogCancelResult>;
  public open(settings?: DialogSettings): Promise<DialogOpenResult | DialogCloseResult | DialogCancelResult>;
  /* tslint:enable:max-line-length */
  public open(settings: DialogSettings = {}): Promise<DialogOpenResult | DialogCloseResult | DialogCancelResult> {
    const childContainer = this.container.createChild();
    let dialogController: DialogController = null as any;
    const closeResult: Promise<DialogCloseResult> = new Promise((resolve, reject) => {
      dialogController = childContainer.invoke(DialogController, [this.createSettings(settings), resolve, reject]);
    });
    childContainer.registerInstance(DialogController, dialogController);
    closeResult.then(() => {
      removeController(this, dialogController);
    }, () => {
      removeController(this, dialogController);
    });
    // tslint:disable-next-line:max-line-length
    const compositionContext = this.createCompositionContext(childContainer, dialogController.renderer.getDialogContainer(), dialogController.settings);
    return this._ensureViewModel(compositionContext).then<boolean>(compositionContext => {
      return invokeLifecycle(compositionContext.viewModel, 'canActivate', dialogController.settings.model);
    }).then(canActivate => {
      if (!canActivate) {
        return this._cancelOperation(dialogController.settings.rejectOnCancel);
      }
      // if activation granted, compose and show
      return this.composeAndShowDialog(compositionContext, dialogController).then(() => {
        // determine whether to return the open or the end result
        if (!dialogController.settings.yieldController) {
          return closeResult;
        }
        return { controller: dialogController, closeResult, wasCancelled: false };
      });
    });
  }

  /**
   * Closes all open dialogs at the time of invocation.
   * @return Promise<DialogController[]> All controllers whose close operation was cancelled.
   */
  public closeAll(): Promise<DialogController[]> {
    return Promise.all(this.controllers.slice(0).map((controller) => {
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
    })).then((unclosedControllers) => unclosedControllers.filter(unclosed => !!unclosed));
  }
}

function removeController(service: DialogService, dialogController: DialogController): void {
  const i = service.controllers.indexOf(dialogController);
  if (i !== -1) {
    service.controllers.splice(i, 1);
    service.hasActiveDialog = service.hasOpenDialog = !!service.controllers.length;
  }
}

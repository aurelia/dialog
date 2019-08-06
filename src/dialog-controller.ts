import { Controller, View } from 'aurelia-templating';
import { Renderer } from './renderer';
import {
  DialogCancelableOperationResult, DialogOpenResult,
  DialogCloseResult, DialogCancelResult
} from './dialog-result';
import { DialogSettings } from './dialog-settings';
import { invokeLifecycle } from './lifecycle';
import { createDialogCloseError, DialogCloseError } from './dialog-close-error';
import { createDialogCancelError } from './dialog-cancel-error';

function isController(controller: any): controller is Controller {
  return !!(controller && controller.viewModel);
}

/**
 * A controller object for a Dialog instance.
 */
export class DialogController {
  private resolve: (data?: any) => void;
  private reject: <T extends Error>(reason: T) => void;

  /**
   * The settings used by this controller.
   */
  public settings: DialogSettings;

  /**
   * @internal
   */
  public renderer: Renderer;

  /**
   * @internal
   */
  public controller?: Controller;

  /**
   * @internal
   */
  public view: View;

  /**
   * @internal
   */
  public closePromise: Promise<any> | undefined;

  /**
   * @internal
   */
  // tslint:disable-next-line:member-ordering
  public static inject = [Renderer];
  /**
   * Creates an instance of DialogController.
   */
  constructor(renderer: Renderer, settings: DialogSettings) {
    this.renderer = renderer;
    this.settings = settings;
  }

  /**
   * @internal
   */
  public initialize(controllerOrView: Controller | View): void {
    if (isController(controllerOrView)) {
      this.controller = controllerOrView;
      this.view = this.controller.view;
      return;
    }
    this.view = controllerOrView;
  }

  /**
   * @internal
   */
  public deactivate(result: DialogCloseResult | DialogCloseError): Promise<void> {
    if (this.controller) {
      return invokeLifecycle(this.controller.viewModel, 'deactivate', result);
    }
    return Promise.resolve();
  }

  /**
   * @internal
   */
  public show(): Promise<DialogOpenResult> {
    return this.renderer.showDialog(this)
      .then<DialogOpenResult>(() => {
        return {
          controller: this,
          wasCancelled: false,
          closeResult: new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
          })
        };
      });
  }

  // /**
  //  * @internal
  //  */
  // public hide(): Promise<void> {
  //   return this.renderer.hideDialog(this);
  // }

  /**
   * @internal
   */
  public releaseResources(result: DialogCloseResult | DialogCloseError): Promise<void> {
    return this.deactivate(result)
      .then(() => this.renderer.hideDialog(this))
      .then(() => {
        this.controller.unbind();
      });
  }

  /**
   * @internal
   */
  public cancelOperation(): DialogCancelResult {
    if (!this.settings.rejectOnCancel) {
      return { wasCancelled: true };
    }
    throw createDialogCancelError();
  }

  /**
   * Closes the dialog with a successful output.
   * @param output The returned success output.
   */
  public ok(output?: any): Promise<DialogCancelableOperationResult> {
    return this.close(true, output);
  }

  /**
   * Closes the dialog with a cancel output.
   * @param output The returned cancel output.
   */
  public cancel(output?: any): Promise<DialogCancelableOperationResult> {
    return this.close(false, output);
  }

  /**
   * Closes the dialog with an error output.
   * @param output A reason for closing with an error.
   * @returns Promise An empty promise object.
   */
  public error(output: any): Promise<void> {
    const closeError = createDialogCloseError(output);
    return this.releaseResources(closeError).then(() => { this.reject(closeError); });
  }

  /**
   * Closes the dialog.
   * @param ok Whether or not the user input signified success.
   * @param output The specified output.
   * @returns Promise An empty promise object.
   */
  public close(ok: boolean, output?: any): Promise<DialogCancelableOperationResult> {
    if (this.closePromise) {
      return this.closePromise;
    }

    const dialogResult: DialogCloseResult = { wasCancelled: !ok, output };

    // tslint:disable-next-line:max-line-length
    return this.closePromise = invokeLifecycle((this.controller && this.controller.viewModel) || {}, 'canDeactivate', dialogResult)
      .catch(reason => {
        this.closePromise = undefined;
        return Promise.reject(reason);
      }).then(canDeactivate => {
        if (!canDeactivate) {
          this.closePromise = undefined; // we are done, do not block consecutive calls
          return this.cancelOperation();
        }
        return this.releaseResources(dialogResult).then(() => {
          if (!this.settings.rejectOnCancel || ok) {
            this.resolve(dialogResult);
          } else {
            this.reject(createDialogCancelError(output));
          }
          return { wasCancelled: false };
        }).catch(reason => {
          this.closePromise = undefined;
          return Promise.reject(reason);
        });
      });
  }
}

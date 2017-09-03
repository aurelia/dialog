import { Controller } from 'aurelia-templating';
import { Renderer } from './renderer';
import { DialogCancelableOperationResult, DialogCloseResult, DialogCancelResult } from './dialog-result';
import { DialogSettings } from './dialog-settings';
import { invokeLifecycle } from './lifecycle';
import { createDialogCloseError, DialogCloseError } from './dialog-close-error';
import { createDialogCancelError } from './dialog-cancel-error';

/**
 * A controller object for a Dialog instance.
 */
export class DialogController {
  private resolve: (data?: any) => void;
  private reject: (reason: any) => void;

  /**
   * @internal
   */
  public closePromise: Promise<any> | undefined;

  /**
   * The settings used by this controller.
   */
  public settings: DialogSettings;
  public renderer: Renderer;
  public controller: Controller;

  /**
   * @internal
   */
  // tslint:disable-next-line:member-ordering
  public static inject = [Renderer];
  /**
   * Creates an instance of DialogController.
   */
  constructor(
    renderer: Renderer,
    settings: DialogSettings,
    resolve: (data?: any) => void,
    reject: (reason: any) => void) {
    this.resolve = resolve;
    this.reject = reject;
    this.settings = settings;
    this.renderer = renderer;
  }

  /**
   * @internal
   */
  public releaseResources(result: DialogCloseResult | DialogCloseError): Promise<void> {
    return invokeLifecycle(this.controller.viewModel || {}, 'deactivate', result)
      .then(() => this.renderer.hideDialog(this))
      .then(() => { this.controller.unbind(); });
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

    return this.closePromise = invokeLifecycle(this.controller.viewModel || {}, 'canDeactivate', dialogResult)
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

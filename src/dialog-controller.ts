import { inject } from 'aurelia-dependency-injection';
import { Controller } from 'aurelia-templating';
import { Renderer } from './renderer';
import { DialogOperationResult, DialogCloseResult, DialogCancelResult } from './dialog-result';
import { BaseDialogSettings } from './dialog-settings';
import { invokeLifecycle } from './lifecycle';
import { DialogCancelError } from './dialog-cancel-error';

/**
 * A controller object for a Dialog instance.
 */
@inject(Renderer)
export class DialogController {
  private resolve: (data?: any) => void;
  private reject: (reason: any) => void;
  private closePromise: Promise<any> | undefined;

  /**
   * The settings used by this controller.
   */
  public settings: BaseDialogSettings;
  public renderer: Renderer;
  public controller: Controller;

  /**
   * Creates an instance of DialogController.
   */
  // tslint:disable-next-line:max-line-length
  constructor(renderer: Renderer, settings: BaseDialogSettings, resolve: (data?: any) => void, reject: (reason: any) => void) {
    this.resolve = resolve;
    this.reject = reject;
    this.settings = settings;
    this.renderer = renderer;
  }

  private releaseResources(): Promise<void> {
    return invokeLifecycle(this.controller.viewModel, 'deactivate')
      .then(() => this.renderer.hideDialog(this))
      .then(() => { this.controller.unbind(); });
  }

  private cancelOperation(): DialogCancelResult {
    if (!this.settings.rejectOnCancel) {
      return { wasCancelled: true };
    }
    throw new DialogCancelError();
  }

  /**
   * Closes the dialog with a successful output.
   * @param output The returned success output.
   */
  public ok(output?: any): Promise<DialogOperationResult> {
    return this.close(true, output);
  }

  /**
   * Closes the dialog with a cancel output.
   * @param output The returned cancel output.
   */
  public cancel(output?: any): Promise<DialogOperationResult> {
    return this.close(false, output);
  }

  /**
   * Closes the dialog with an error result.
   * @param message An error message.
   * @returns Promise An empty promise object.
   */
  public error(message: any): Promise<void> {
    return this.releaseResources().then(() => { this.reject(message); });
  }

  /**
   * Closes the dialog.
   * @param ok Whether or not the user input signified success.
   * @param output The specified output.
   * @returns Promise An empty promise object.
   */
  public close(ok: boolean, output?: any): Promise<DialogOperationResult> {
    if (this.closePromise) {
      return this.closePromise;
    }

    return this.closePromise = invokeLifecycle(this.controller.viewModel, 'canDeactivate').catch(reason => {
      this.closePromise = undefined;
      return Promise.reject(reason);
    }).then(canDeactivate => {
      if (!canDeactivate) {
        this.closePromise = undefined; // we are done, do not block consecutive calls
        return this.cancelOperation();
      }
      return this.releaseResources().then(() => {
        if (!this.settings.rejectOnCancel || ok) {
          this.resolve({ wasCancelled: !ok, output } as DialogCloseResult);
        } else {
          this.reject(new DialogCancelError(output));
        }
        return { wasCancelled: false };
      }).catch(reason => {
        this.closePromise = undefined;
        return Promise.reject(reason);
      });
    });
  }
}

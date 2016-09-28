import {invokeLifecycle} from './lifecycle';
import {DialogResult} from './dialog-result';

/**
 * A controller object for a Dialog instance.
 */
export class DialogController {
  /**
   * The settings used by this controller.
   */
  settings: any;

  /**
   * Creates an instance of DialogController.
   */
  constructor(renderer: DialogRenderer, settings: any, resolve: Function, reject: Function) {
    this.renderer = renderer;
    this.settings = settings;
    this._resolve = resolve;
    this._reject = reject;
  }

  /**
   * Closes the dialog with a successful output.
   * @param output The returned success output.
   */
  ok(output?: any): Promise<DialogResult> {
    return this.close(true, output);
  }

  /**
   * Closes the dialog with a cancel output.
   * @param output The returned cancel output.
   */
  cancel(output?: any): Promise<DialogResult> {
    return this.close(false, output);
  }

  /**
   * Closes the dialog with an error result.
   * @param message An error message.
   * @returns Promise An empty promise object.
   */
  error(message: any): Promise<void> {
    return invokeLifecycle(this.viewModel, 'deactivate')
      .then(() => {
        return this.renderer.hideDialog(this);
      }).then(() => {
        this.controller.unbind();
        this._reject(message);
      });
  }

  /**
   * Closes the dialog.
   * @param ok Whether or not the user input signified success.
   * @param output The specified output.
   * @returns Promise An empty promise object.
   */
  close(ok: boolean, output?: any): Promise<DialogResult> {
    if (this._closePromise) {
      return this._closePromise;
    }

    this._closePromise = invokeLifecycle(this.viewModel, 'canDeactivate').then(canDeactivate => {
      if (canDeactivate) {
        return invokeLifecycle(this.viewModel, 'deactivate')
          .then(() => {
            return this.renderer.hideDialog(this);
          }).then(() => {
            let result = new DialogResult(!ok, output);
            this.controller.unbind();
            this._resolve(result);
            return result;
          });
      }

      this._closePromise = undefined;
    }, e => {
      this._closePromise = undefined;
      return Promise.reject(e);
    });

    return this._closePromise;
  }
}

import {invokeLifecycle} from './lifecycle';


/**
 * A controller object for a Dialog instance.
 * @constructor
 */
export class DialogController {
  settings: any;
  constructor(renderer: DialogRenderer, settings: any, resolve: Function, reject: Function) {
    this._renderer = renderer;
    this.settings = Object.assign({}, this._renderer.defaultSettings, settings);
    this._resolve = resolve;
    this._reject = reject;
  }

  /**
   * Closes the dialog with a successful result.
   * @param result The returned success result.
   */
  ok(result: any) {
    this.close(true, result);
  }

  /**
   * Closes the dialog with a cancel result.
   * @param result The returned cancel result.
   */
  cancel(result: any) {
    this.close(false, result);
  }

  /**
   * Closes the dialog with an error result.
   * @param message An error message.
   * @returns Promise An empty promise object.
   */
  error(message: any) {
    return invokeLifecycle(this.viewModel, 'deactivate')
      .then(() => {
        return this._renderer.hideDialog(this);
      }).then(() => {
        this.controller.unbind();
        this._reject(message);
      });
  }

  /**
   * Closes the dialog.
   * @param ok Whether or not the user input signified success.
   * @param result The specified result.
   * @returns Promise An empty promise object.
   */
  close(ok: boolean, result: any) {
    let returnResult = new DialogResult(!ok, result);
    return invokeLifecycle(this.viewModel, 'canDeactivate').then(canDeactivate => {
      if (canDeactivate) {
        return invokeLifecycle(this.viewModel, 'deactivate')
          .then(() => {
            return this._renderer.hideDialog(this);
          }).then(() => {
            this.controller.unbind();
            this._resolve(returnResult);
          });
      }
    });
  }
}

export class DialogResult {
  wasCancelled: boolean = false;
  output: any;
  constructor(cancelled: boolean, result: any) {
    this.wasCancelled = cancelled;
    this.output = result;
  }
}

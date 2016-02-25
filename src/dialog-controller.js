import {invokeLifecycle} from './lifecycle';

export class DialogController {
  settings: any;
  constructor(renderer: DialogRenderer, settings: any, resolve: Function, reject: Function) {
    this._renderer = renderer;
    this.settings = settings;
    this._resolve = resolve;
    this._reject = reject;
  }

  ok(result: any) {
    this.close(true, result);
  }

  cancel(result: any) {
    this.close(false, result);
  }

  error(message: any) {
    return invokeLifecycle(this.viewModel, 'deactivate').then(() => {
      return this._renderer.hideDialog(this).then(() => {
        return this._renderer.destroyDialogHost(this).then(() => {
          this.controller.unbind();
          this._reject(message);
        });
      });
    });
  }

  close(ok: boolean, result: any) {
    let returnResult = new DialogResult(!ok, result);
    return invokeLifecycle(this.viewModel, 'canDeactivate').then(canDeactivate => {
      if (canDeactivate) {
        return invokeLifecycle(this.viewModel, 'deactivate').then(() => {
          return this._renderer.hideDialog(this).then(() => {
            return this._renderer.destroyDialogHost(this).then(() => {
              this.controller.unbind();
              this._resolve(returnResult);
            });
          });
        });
      }
    });
  }
}

class DialogResult {
  wasCancelled: boolean = false;
  output: any;
  constructor(cancelled: boolean, result: any) {
    this.wasCancelled = cancelled;
    this.output = result;
  }
}

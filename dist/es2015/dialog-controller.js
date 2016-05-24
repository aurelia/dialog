import { invokeLifecycle } from './lifecycle';

export let DialogController = class DialogController {
  constructor(renderer, settings, resolve, reject) {
    this._renderer = renderer;
    this.settings = Object.assign({}, this._renderer.defaultSettings, settings);
    this._resolve = resolve;
    this._reject = reject;
  }

  ok(result) {
    this.close(true, result);
  }

  cancel(result) {
    this.close(false, result);
  }

  error(message) {
    return invokeLifecycle(this.viewModel, 'deactivate').then(() => {
      return this._renderer.hideDialog(this);
    }).then(() => {
      this.controller.unbind();
      this._reject(message);
    });
  }

  close(ok, result) {
    let returnResult = new DialogResult(!ok, result);
    return invokeLifecycle(this.viewModel, 'canDeactivate').then(canDeactivate => {
      if (canDeactivate) {
        return invokeLifecycle(this.viewModel, 'deactivate').then(() => {
          return this._renderer.hideDialog(this);
        }).then(() => {
          this.controller.unbind();
          this._resolve(returnResult);
        });
      }
    });
  }
};

export let DialogResult = class DialogResult {
  constructor(cancelled, result) {
    this.wasCancelled = false;

    this.wasCancelled = cancelled;
    this.output = result;
  }
};
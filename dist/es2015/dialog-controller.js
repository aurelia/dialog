import { invokeLifecycle } from './lifecycle';
import { DialogResult } from './dialog-result';

export let DialogController = class DialogController {
  constructor(renderer, settings, resolve, reject) {
    this.renderer = renderer;
    this.settings = settings;
    this._resolve = resolve;
    this._reject = reject;
  }

  ok(output) {
    return this.close(true, output);
  }

  cancel(output) {
    return this.close(false, output);
  }

  error(message) {
    return invokeLifecycle(this.viewModel, 'deactivate').then(() => {
      return this.renderer.hideDialog(this);
    }).then(() => {
      this.controller.unbind();
      this._reject(message);
    });
  }

  close(ok, output) {
    if (this._closePromise) {
      return this._closePromise;
    }

    this._closePromise = invokeLifecycle(this.viewModel, 'canDeactivate').then(canDeactivate => {
      if (canDeactivate) {
        return invokeLifecycle(this.viewModel, 'deactivate').then(() => {
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
};
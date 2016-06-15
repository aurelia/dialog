import { invokeLifecycle } from './lifecycle';
import { DialogResult } from './dialog-result';

export let DialogController = class DialogController {
  constructor(renderer, settings, resolve, reject) {
    let defaultSettings = renderer ? renderer.defaultSettings || {} : {};

    this.renderer = renderer;
    this.settings = Object.assign({}, defaultSettings, settings);
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
    return invokeLifecycle(this.viewModel, 'canDeactivate').then(canDeactivate => {
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

      return Promise.resolve();
    });
  }
};
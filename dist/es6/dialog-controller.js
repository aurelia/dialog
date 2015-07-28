import {invokeLifecycle} from './lifecycle';

export class DialogController {
  constructor(renderer, settings, resolve, reject){
    this._renderer = renderer;
    this.settings = settings;
    this._resolve = resolve;
    this._reject = reject;
  }

  ok(result){
    this.close(true, result);
  }

  cancel(result){
    this.close(false, result);
  }

  close(success, result){
    return invokeLifecycle(this.viewModel, 'canDeactivate').then(canDeactivate =>{
      if(canDeactivate){
        return invokeLifecycle(this.viewModel, 'deactivate').then(() => {
          return this._renderer.hideDialog(this).then(() => {
            return this._renderer.destroyDialogHost(this).then(() => {
              this.behavior.unbind();

              if(success){
                this._resolve(result);
              } else{
                this._reject(result);
              }
            });
          });
        });
      }

      return Promise.reject();
    });
  }
}

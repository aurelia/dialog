import {invokeLifecycle} from './lifecycle';
import {handleEventListeners} from './util';
const GLOBAL_ACTIVE_CLASS  = 'ai-dialog-active';
const ELEMENT_ACTIVE_CLASS = 'active';


export class DialogController {
  constructor(renderer, settings, resolve, reject) {
    this._renderer = renderer;
    this.settings = settings;
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
    return this._renderer.deactivateLifecycle(this, message);
  }

  close(ok, result) {
    let returnResult = new DialogResult(!ok, result);
    return this._renderer.deactivateLifecycle(this, returnResult);
  }

  showDialog() {
    return this.handleAnimations(true);
  }

  hideDialog() {
    return this.handleAnimations(false);
  }

  handleAnimations(value) {
    let toggle = value ? 'add' : 'remove';
    let element = this.element;
    return handleEventListeners(element, 'animationend', trigger);

    ///////////////////
    function trigger() {
      element.classList[toggle](ELEMENT_ACTIVE_CLASS);
      document.body.classList[toggle](GLOBAL_ACTIVE_CLASS);
    }
  }
}

class DialogResult {
  wasCancelled = false;
  output;
  constructor(cancelled, result) {
    this.wasCancelled = cancelled;
    this.output = result;
  }
}

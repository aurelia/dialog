import {customElement, bindable} from 'aurelia-templating';
import {DialogController} from './dialog-controller';

@customElement('dialog-footer')
export class DialogFooter {
  static inject = [DialogController];

  @bindable buttons = [];
  @bindable useDefaultButtons = false;

  constructor(controller) {
    this.controller = controller;
  }

  close(buttonValue) {
    if (DialogFooter.isCancelButton(buttonValue)) {
      this.controller.cancel(buttonValue);
    } else {
      this.controller.ok(buttonValue);
    }
  }

  useDefaultButtonsChanged(newValue) {
    if (newValue) {
      this.buttons = ['Cancel', 'Ok'];
    }
  }

  static isCancelButton(value) {
    return value === 'Cancel';
  }
}

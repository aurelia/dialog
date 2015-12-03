import {customElement, bindable} from 'aurelia-templating';
import {DialogController} from './dialog-controller';

@customElement('ai-dialog-footer')
export class AiDialogFooter {
  static inject = [DialogController];

  @bindable buttons = [];
  @bindable useDefaultButtons = false;

  constructor(controller) {
    this.controller = controller;
  }

  close(buttonValue) {
    if (AiDialogFooter.isCancelButton(buttonValue)) {
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

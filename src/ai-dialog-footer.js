import {customElement, bindable, inlineView} from 'aurelia-templating';
import {DialogController} from './dialog-controller';

/**
 * * View-model for footer of Dialog.
 * */
@customElement('ai-dialog-footer')
@inlineView(`
  <template>
    <slot></slot>

    <template if.bind="buttons.length > 0">
      <button type="button" class="btn btn-default" repeat.for="button of buttons" click.trigger="close(button)">\${button}</button>
    </template>
  </template>
`)
export class AiDialogFooter {
  static inject = [DialogController];

  @bindable buttons: any[] = [];
  @bindable useDefaultButtons: boolean = false;

  constructor(controller: DialogController) {
    this.controller = controller;
  }

  close(buttonValue: string) {
    if (AiDialogFooter.isCancelButton(buttonValue)) {
      this.controller.cancel(buttonValue);
    } else {
      this.controller.ok(buttonValue);
    }
  }

  useDefaultButtonsChanged(newValue: boolean) {
    if (newValue) {
      this.buttons = ['Cancel', 'Ok'];
    }
  }

  static isCancelButton(value: string) {
    return value === 'Cancel';
  }
}

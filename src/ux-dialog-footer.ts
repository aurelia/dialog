import { customElement, bindable, inlineView } from 'aurelia-templating';
import { DialogController } from './dialog-controller';

/**
 * View-model for footer of Dialog.
 */
@customElement('ux-dialog-footer')
@inlineView(`
  <template>
    <slot></slot>
    <template if.bind="buttons.length > 0">
      <button type="button"
        class="btn btn-default"
        repeat.for="button of buttons"
        click.trigger="close(button)">
        \${button}
      </button>
    </template>
  </template>
`)

export class UxDialogFooter {
  public static isCancelButton(value: string) {
    return value === 'Cancel';
  }

  @bindable public buttons: any[] = [];
  @bindable public useDefaultButtons: boolean = false;

  /**
   * @internal
   */
  public static inject = [DialogController];
  constructor(public controller: DialogController) { }

  public close(buttonValue: string) {
    if (UxDialogFooter.isCancelButton(buttonValue)) {
      this.controller.cancel(buttonValue);
    } else {
      this.controller.ok(buttonValue);
    }
  }

  public useDefaultButtonsChanged(newValue: boolean) {
    if (newValue) {
      this.buttons = ['Cancel', 'Ok'];
    }
  }
}

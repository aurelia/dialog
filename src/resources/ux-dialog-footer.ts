import { DialogController } from '../dialog-controller';

/**
 * View-model for footer of Dialog.
 */
export class UxDialogFooter {

  /**
   * @internal
   */
  // tslint:disable-next-line:member-ordering
  public static inject = [DialogController];

  /**
   * @internal
   */
  // tslint:disable-next-line:member-ordering
  public static $view =
`<template>
  <slot></slot>
  <template if.bind="buttons.length > 0">
    <button type="button"
      class="btn btn-default"
      repeat.for="button of buttons"
      click.trigger="close(button)">
      \${button}
    </button>
  </template>
</template>`;

  /**
   * @internal
   */
  // tslint:disable-next-line:member-ordering
  public static $resource = {
    name: 'ux-dialog-footer',
    bindables: ['buttons', 'useDefaultButtons']
  };

  public static isCancelButton(value: string) {
    return value === 'Cancel';
  }

  /**
   * @bindable
   */
  public buttons: any[] = [];
  /**
   * @bindable
   */
  public useDefaultButtons: boolean = false;

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

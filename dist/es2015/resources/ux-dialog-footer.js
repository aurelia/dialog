import { DialogController } from '../dialog-controller';
/**
 * View-model for footer of Dialog.
 */
export class UxDialogFooter {
    constructor(controller) {
        this.controller = controller;
        /**
         * @bindable
         */
        this.buttons = [];
        /**
         * @bindable
         */
        this.useDefaultButtons = false;
    }
    static isCancelButton(value) {
        return value === 'Cancel';
    }
    close(buttonValue) {
        if (UxDialogFooter.isCancelButton(buttonValue)) {
            this.controller.cancel(buttonValue);
        }
        else {
            this.controller.ok(buttonValue);
        }
    }
    useDefaultButtonsChanged(newValue) {
        if (newValue) {
            this.buttons = ['Cancel', 'Ok'];
        }
    }
}
/**
 * @internal
 */
// tslint:disable-next-line:member-ordering
UxDialogFooter.inject = [DialogController];
/**
 * @internal
 */
// tslint:disable-next-line:member-ordering
UxDialogFooter.$view = `<template>
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
UxDialogFooter.$resource = {
    name: 'ux-dialog-footer',
    bindables: ['buttons', 'useDefaultButtons']
};

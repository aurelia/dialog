import { D as DialogController } from './dialog-controller.js';

class UxDialogFooter {
    constructor(controller) {
        this.controller = controller;
        this.buttons = [];
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
UxDialogFooter.inject = [DialogController];
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
UxDialogFooter.$resource = {
    name: 'ux-dialog-footer',
    bindables: ['buttons', 'useDefaultButtons']
};

export { UxDialogFooter };
//# sourceMappingURL=ux-dialog-footer.js.map

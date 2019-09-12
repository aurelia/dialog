import { D as DialogController } from './dialog-controller.js';

class UxDialogHeader {
    constructor(controller) {
        this.controller = controller;
    }
    bind() {
        if (typeof this.showCloseButton !== 'boolean') {
            this.showCloseButton = !this.controller.settings.lock;
        }
    }
}
UxDialogHeader.inject = [DialogController];
UxDialogHeader.$view = `<template>
  <button
    type="button"
    class="dialog-close"
    aria-label="Close"
    if.bind="showCloseButton"
    click.trigger="controller.cancel()">
    <span aria-hidden="true">&times;</span>
  </button>

  <div class="dialog-header-content">
    <slot></slot>
  </div>
</template>`;
UxDialogHeader.$resource = {
    name: 'ux-dialog-header',
    bindables: ['showCloseButton']
};

export { UxDialogHeader };
//# sourceMappingURL=ux-dialog-header.js.map

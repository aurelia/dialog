import { DialogController } from '../dialog-controller';
export class UxDialogHeader {
    constructor(controller) {
        this.controller = controller;
    }
    bind() {
        if (typeof this.showCloseButton !== 'boolean') {
            this.showCloseButton = !this.controller.settings.lock;
        }
    }
}
/**
 * @internal
 */
// tslint:disable-next-line:member-ordering
UxDialogHeader.inject = [DialogController];
/**
 * @internal
 */
// tslint:disable-next-line:member-ordering
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
/**
 * @internal
 */
// tslint:disable-next-line:member-ordering
UxDialogHeader.$resource = {
    name: 'ux-dialog-header',
    bindables: ['showCloseButton']
};

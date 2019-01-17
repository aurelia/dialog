import { ComponentBind } from 'aurelia-templating';
import { DialogController } from '../dialog-controller';

export class UxDialogHeader implements ComponentBind {

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
  public static $resource = {
    name: 'ux-dialog-header',
    bindables: ['showCloseButton']
  };

  /**
   * @bindable
   */
  public showCloseButton: boolean | undefined;

  constructor(public controller: DialogController) { }

  public bind(): void {
    if (typeof this.showCloseButton !== 'boolean') {
      this.showCloseButton = !this.controller.settings.lock;
    }
  }
}

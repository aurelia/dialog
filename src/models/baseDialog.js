import {DialogController} from '../dialog-controller';

export class BaseDialog {
  static inject = [DialogController];
  constructor(controller) {
    this.controller = controller;
    controller.settings.lock = false;
  }

  activate(model) {
    this.model = model;
  }
}

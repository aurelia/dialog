import {customElement} from 'aurelia-templating';
import {DialogController} from '../dialog-controller';

@customElement('ai-dialog-header')
export class AiDialogHeader {
  static inject = [DialogController];

  constructor(controller) {
    this.controller = controller;
  }
}

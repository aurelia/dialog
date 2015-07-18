import {customElement} from 'aurelia-templating';
import {DialogController} from './dialog-controller';

@customElement('dialog-header')
export class DialogHeader {
  static inject = [DialogController];

  constructor(controller){
    this.controller = controller;
  }
}

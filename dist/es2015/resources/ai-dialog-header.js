var _dec, _class, _class2, _temp;

import { customElement } from 'aurelia-templating';
import { DialogController } from '../dialog-controller';

export let AiDialogHeader = (_dec = customElement('ai-dialog-header'), _dec(_class = (_temp = _class2 = class AiDialogHeader {

  constructor(controller) {
    this.controller = controller;
  }
}, _class2.inject = [DialogController], _temp)) || _class);
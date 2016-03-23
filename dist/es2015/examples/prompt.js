var _class, _temp;

import { DialogController } from '../dialog-controller';

export let Prompt = (_temp = _class = class Prompt {

  constructor(controller) {
    this.controller = controller;
    this.answer = null;

    controller.settings.lock = false;
  }

  activate(question) {
    this.question = question;
  }
}, _class.inject = [DialogController], _temp);
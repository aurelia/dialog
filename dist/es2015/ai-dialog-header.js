var _dec, _dec2, _class, _class2, _temp;

import { customElement, inlineView } from 'aurelia-templating';
import { DialogController } from './dialog-controller';

export let AiDialogHeader = (_dec = customElement('ai-dialog-header'), _dec2 = inlineView(`
  <template>
    <button type="button" class="dialog-close" aria-label="Close" if.bind="!controller.settings.lock" click.trigger="controller.cancel()">
      <span aria-hidden="true">&times;</span>
    </button>

    <div class="dialog-header-content">
      <slot></slot>
    </div>
  </template>
`), _dec(_class = _dec2(_class = (_temp = _class2 = class AiDialogHeader {

  constructor(controller) {
    this.controller = controller;
  }
}, _class2.inject = [DialogController], _temp)) || _class) || _class);
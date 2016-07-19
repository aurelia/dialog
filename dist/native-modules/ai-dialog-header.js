var _dec, _dec2, _class, _class2, _temp;



import { customElement, inlineView } from 'aurelia-templating';
import { DialogController } from './dialog-controller';

export var AiDialogHeader = (_dec = customElement('ai-dialog-header'), _dec2 = inlineView('\n  <template>\n    <button type="button" class="dialog-close" aria-label="Close" if.bind="!controller.settings.lock" click.trigger="controller.cancel()">\n      <span aria-hidden="true">&times;</span>\n    </button>\n\n    <div class="dialog-header-content">\n      <slot></slot>\n    </div>\n  </template>\n'), _dec(_class = _dec2(_class = (_temp = _class2 = function AiDialogHeader(controller) {
  

  this.controller = controller;
}, _class2.inject = [DialogController], _temp)) || _class) || _class);
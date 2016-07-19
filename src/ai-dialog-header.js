import {customElement, inlineView} from 'aurelia-templating';
import {DialogController} from './dialog-controller';

@customElement('ai-dialog-header')
@inlineView(`
  <template>
    <button type="button" class="dialog-close" aria-label="Close" if.bind="!controller.settings.lock" click.trigger="controller.cancel()">
      <span aria-hidden="true">&times;</span>
    </button>

    <div class="dialog-header-content">
      <slot></slot>
    </div>
  </template>
`)
export class AiDialogHeader {
  static inject = [DialogController];

  constructor(controller) {
    this.controller = controller;
  }
}

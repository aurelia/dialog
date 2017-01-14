import {inject} from 'aurelia-dependency-injection';
import {customElement, inlineView} from 'aurelia-templating';
import {DialogController} from './dialog-controller';

@customElement('ai-dialog-header')
/* tslint:disable:max-line-length */
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
/* tslint:enable:max-line-length */
@inject(DialogController)
export class AiDialogHeader {
  constructor(public controller: DialogController) { }
}

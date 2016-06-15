import {customElement, inlineView} from 'aurelia-templating';

@customElement('ai-dialog-body')
@inlineView(`
  <template>
    <slot></slot>
  </template>
`)
export class AiDialogBody {

}

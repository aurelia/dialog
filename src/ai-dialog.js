import {customElement, inlineView} from 'aurelia-templating';

@customElement('ai-dialog')
@inlineView(`
  <template>
    <slot></slot>
  </template>
`)
export class AiDialog {

}

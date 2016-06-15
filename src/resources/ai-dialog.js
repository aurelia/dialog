import {customElement, inlineView} from 'aurelia-templating';

@customElement('ai-dialog')
@inlineView(`
  <template>
    <require from="../dialog.css"></require>
    <slot></slot>
  </template>
`)
export class AiDialog {

}

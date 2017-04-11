import { customElement, inlineView } from 'aurelia-templating';

@customElement('ux-dialog')
@inlineView(`
  <template>
    <slot></slot>
  </template>
`)
export class UxDialog {

}

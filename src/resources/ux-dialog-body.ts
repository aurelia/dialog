import { customElement, inlineView } from 'aurelia-templating';

@customElement('ux-dialog-body')
@inlineView(`
  <template>
    <slot></slot>
  </template>
`)
export class UxDialogBody {

}

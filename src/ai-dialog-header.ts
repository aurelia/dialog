import { customElement, bindable, inlineView } from 'aurelia-templating';
import { DialogController } from './dialog-controller';

@customElement('ai-dialog-header')
@inlineView(`
  <template>
    <button
      type="button"
      class="dialog-close"
      aria-label="Close"
      show.bind="showCloseButton"
      click.trigger="controller.cancel()">
      <span aria-hidden="true">&times;</span>
    </button>

    <div class="dialog-header-content">
      <slot></slot>
    </div>
  </template>
`)

export class AiDialogHeader {
  @bindable() public showCloseButton: boolean = false;

  /**
   * @internal
   */
  public static inject = [DialogController];
  constructor(public controller: DialogController) { }
}

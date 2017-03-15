import { customElement, bindable, inlineView, ComponentBind } from 'aurelia-templating';
import { DialogController } from './dialog-controller';

@customElement('ai-dialog-header')
@inlineView(`
  <template>
    <button
      type="button"
      class="dialog-close"
      aria-label="Close"
      if.bind="showCloseButton"
      click.trigger="controller.cancel()">
      <span aria-hidden="true">&times;</span>
    </button>

    <div class="dialog-header-content">
      <slot></slot>
    </div>
  </template>
`)

export class AiDialogHeader implements ComponentBind {
  @bindable() public showCloseButton: boolean | undefined;

  /**
   * @internal
   */
  public static inject = [DialogController];
  constructor(public controller: DialogController) { }

  public bind(): void {
    if (typeof this.showCloseButton !== 'boolean') {
      this.showCloseButton = !this.controller.settings.lock;
    }
  }
}

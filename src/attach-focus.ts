import { bindingMode } from 'aurelia-binding';
import { customAttribute, ComponentAttached } from 'aurelia-templating';
import { DOM } from 'aurelia-pal';

@customAttribute('attach-focus', bindingMode.oneTime)
export class AttachFocus implements ComponentAttached {
  public value: boolean | string;

  /**
   * @internal
   */
  // tslint:disable-next-line:member-ordering
  public static inject = [DOM.Element];
  constructor(private element: HTMLElement) {
    this.value = true;
  }

  public attached(): void {
    if (this.value === '' || (this.value && this.value !== 'false')) {
      this.element.focus();
    }
  }
}

import { customAttribute, ComponentAttached } from 'aurelia-templating';
import { DOM } from 'aurelia-pal';

@customAttribute('attach-focus')
export class AttachFocus implements ComponentAttached {
  public value: boolean | string;

  /**
   * @internal
   */
  public static inject = [DOM.Element];
  constructor(private element: HTMLElement) {
    this.value = true;
  }

  public attached(): void {
    if (this.value && this.value !== 'false') {
      this.element.focus();
    }
  }

  public valueChanged(newValue: string) {
    this.value = newValue;
  }
}

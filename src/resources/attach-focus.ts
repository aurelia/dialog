import { DOM } from 'aurelia-pal';
import { ComponentAttached } from 'aurelia-templating';

export class AttachFocus implements ComponentAttached {

  /**
   * @internal
   */
  public static $resource = {
    type: 'attribute',
    name: 'attach-focus'
  };

  /**
   * @internal
   */
  // tslint:disable-next-line:member-ordering
  public static inject() {
    return [DOM.Element];
  }

  public value: boolean | string;

  constructor(private element: HTMLElement) {
    this.value = true;
    this.element = element;
  }

  public attached(): void {
    if (this.value === '' || (this.value && this.value !== 'false')) {
      this.element.focus();
    }
  }
}

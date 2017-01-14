import {inject} from 'aurelia-dependency-injection';
import {customAttribute, ComponentAttached} from 'aurelia-templating';
import {DOM} from 'aurelia-pal';

@customAttribute('attach-focus')
@inject(DOM.Element)
export class AttachFocus implements ComponentAttached {
  public value: boolean | string;

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

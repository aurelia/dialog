import {customAttribute} from 'aurelia-templating';

@customAttribute('attach-focus')
export class AttachFocus {
  static inject = [Element];

  value = true;

  constructor(element) {
    this.element = element;
  }

  attached() {
    if (this.value && this.value !== 'false') {
      this.element.focus();
    }
  }

  valueChanged(newValue) {
    this.value = newValue;
  }
}

var _dec, _class, _class2, _temp;

import { customAttribute } from 'aurelia-templating';

export let AttachFocus = (_dec = customAttribute('attach-focus'), _dec(_class = (_temp = _class2 = class AttachFocus {

  constructor(element) {
    this.value = true;

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
}, _class2.inject = [Element], _temp)) || _class);
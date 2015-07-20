import {customAttribute} from 'aurelia-templating';
import {inject} from 'aurelia-framework';

let Element = document.createElement('dialog');
@customAttribute('attach-focus')
@inject(Element)
export class AttachFocus {

  constructor(element){
    this.element = element;
  }

  attached(){
    this.element.focus();
  }
}

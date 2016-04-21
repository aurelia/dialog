import {DialogController} from 'aurelia-dialog';

export class EditPerson {
  static inject = [DialogController];
  person = { firstName: '' };
  constructor(controller){
    this.controller = controller;
    this.controller.settings.lock = false;
  }
  activate(person){
    this.person = person;
  }

  testDelegate () {
    alert("Delegation worked");
  }
}
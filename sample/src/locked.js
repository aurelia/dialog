import {DialogController} from 'aurelia-dialog';

export class Locked {
  static inject = [DialogController];
  person = { firstName: '' };
  constructor(controller){
    this.controller = controller;
  }
  activate(person){
    this.person = person;
  }

  testDelegate () {
    alert("Delegation worked");
  }
}

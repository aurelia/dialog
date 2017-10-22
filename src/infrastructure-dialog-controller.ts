import { Controller, View } from 'aurelia-templating';
import { DialogController } from './dialog-controller';

export interface InfrastructureDialogController extends DialogController {
  controller?: Controller;
  view: View;
}

import {DialogController} from '../dialog-controller';
import {BaseDialog} from './baseDialog';
export class Alert extends BaseDialog {
  static inject = [DialogController];

  constructor(controller) {
    super(controller);
  }
}

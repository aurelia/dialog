import {DialogController} from './dialog-controller';

// TODO: add doc

export interface DialogOperationResult {
  wasCancelled: boolean;
}

export interface DialogCancelResult extends DialogOperationResult {
  wasCancelled: true;
}

export interface DialogCloseResult extends DialogOperationResult {
  output?: any;
}

export interface DialogOpenResult extends DialogOperationResult {
  wasCancelled: false;
  controller: DialogController;
  closeResult: Promise<DialogCloseResult>;
}

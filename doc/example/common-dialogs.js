import {Prompt} from './prompt';
import {DialogService} from '../dialog-service';

export class CommonDialogs {
  static inject = [DialogService];

  constructor(dialogService) {
    this.dialogService = dialogService;
  }

  prompt(question) {
    return this.dialogService.open({viewModel: Prompt, model: question});
  }
}

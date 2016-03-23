var _class, _temp;

import { Prompt } from './prompt';
import { DialogService } from '../dialog-service';

export let CommonDialogs = (_temp = _class = class CommonDialogs {

  constructor(dialogService) {
    this.dialogService = dialogService;
  }

  prompt(question) {
    return this.dialogService.open({ viewModel: Prompt, model: question });
  }
}, _class.inject = [DialogService], _temp);
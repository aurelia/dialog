import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {EditPerson} from './edit-person';

@inject(DialogService)
export class App {
  constructor(dialogService) {
    this.dialogService = dialogService;
    this.showExtraData = true;
  }

  submit(){
    this.dialogService.open({ viewModel: EditPerson, model: { firstName: 'Owen', testScrolling: this.showExtraData }}).then((result) => {
      if (!result.wasCancelled) {
        console.log('good');
        console.log(result.output);
      } else {
        console.log('bad');
      }
    });
  }

  positionManually(e) {
    const settings = {
      viewModel: EditPerson,
      model: { firstName: 'Owen', testScrolling: this.showExtraData },
      position: (modalContainer) => {
        const { offsetWidth, offsetLeft, offsetTop } = e.target;

        const dialog = modalContainer.querySelector('ai-dialog');
        dialog.style.position = 'absolute';
        dialog.style.top = offsetTop + 'px';
        dialog.style.left = offsetLeft + offsetWidth + 'px';

        // quick override on the style
        dialog.style.margin = '0';
      }
    };

    this.dialogService.open(settings).then((result) => {
      if (!result.wasCancelled) {
        console.log('good');
        console.log(result.output);
      } else {
        console.log('bad');
      }
    });
  }
}

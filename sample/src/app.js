import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {EditPerson} from './edit-person';
import {Progress} from './progress';

@inject(DialogService)
export class App {
  constructor(dialogService) {
    this.dialogService = dialogService;
  }

  submit(){
    this.dialogService.open({ viewModel: EditPerson, model: { firstName: 'Owen' }}).then((result) => {
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
      model: { firstName: 'Owen' },
      position: (modalContainer) => {
        const { offsetWidth, offsetLeft, offsetTop } = e.target;

        const dialog = modalContainer.querySelector('ai-dialog');
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



  slowProgress(e) {
    let progressOptions = {
      waitMessage: "Fetching slow data"
    };
    this.dialogService.open({
      viewModel: Progress,
      model: progressOptions
    });

    let process = {
      progressInterval: 500,
      progressPercentIncrease: 20
    }
    setTimeout(this.incrementProgress, process.progressInterval, this, process, progressOptions);
  }

  faultyProgress(e) {
    alert('Faulty as it closes synchronously instead of after the open promise.'
      + ' If pressed first, the close will fail and the console will log the caught promise error "TypeError: dialogController.hideDialog is not a function".'
      + ' If another button is pressed first, it will silently fail to destroy the dialog, leaving ai-dialog-overlay hidden but still blocking.')

    let progressOptions = {
      waitMessage: "Fetching fast data",
    };
    this.dialogService.open({
      viewModel: Progress,
      model: progressOptions
    });

    let process = {
      progressInterval: 0,            //faster than transitionEnd event, so open is not completed.
      progressPercentIncrease: 100
    }
    setTimeout(this.incrementProgress, process.progressInterval, this, process, progressOptions);
  }

  fastProgress(e) {
    let progressOptions = {
      waitMessage: "Fetching fast data",
    };
    this.dialogService.open({
      viewModel: Progress,
      model: progressOptions
    });

    let process = {
      progressInterval: 0,
      progressPercentIncrease: 100,
      terminateProgressDailog: () => {
        //have to let renderer completely build controller, so
        progressOptions.showDialogPromise.then(() => {
          progressOptions.closeDialog();
        });
      }
    }

    setTimeout(this.incrementProgress, process.progressInterval, this, process, progressOptions);
  }

  fastestProgress(e) {
    let progressOptions = {
      waitMessage: "Get data now"
    };

    this.dialogService.open({
      viewModel: Progress,
      model: progressOptions
    });

    //no timeout progress, straight to close
    progressOptions.showDialogPromise.then(() => {
      progressOptions.closeDialog();
    });
  }


  incrementProgress(that, process, progressOptions) {
    let completedPercent = progressOptions.incrementProgress(process.progressPercentIncrease);
    if (completedPercent < 100) {
      setTimeout(that.incrementProgress, process.progressInterval, that, process, progressOptions);
    } else {
      if (process.terminateProgressDailog) {
        process.terminateProgressDailog();
      } else {
        progressOptions.closeDialog();
      }
    }
  }
}

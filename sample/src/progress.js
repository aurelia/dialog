import {DialogController} from 'aurelia-dialog';

export class Progress {
  static inject = [DialogController];

  constructor(controller) {
    this.controller = controller;
  }

  activate(progressOptions) {
    this.progressOptions = progressOptions;
    this.waitMessage = progressOptions.waitMessage || 'Waiting';
    this.completedPercent = 0;

    let that = this;
    progressOptions.incrementProgress = (percentIncrease) => {
      that.completedPercent += percentIncrease;
      return that.completedPercent;
    }

    progressOptions.closeDialog = () => {
      that.controller.close(true, null)
        .catch((error) => {
          //dont care if close failed
          console.log("Error: controller.close threw error: " + error);
        });
    }
  }
}

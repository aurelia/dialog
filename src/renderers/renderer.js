export class Renderer {
  getDialogContainer() {
    throw new Error('DialogRenderer must implement getDialogContainer().');
  }

  showDialog(dialogController: DialogController) {
    throw new Error('DialogRenderer must implement showDialog().');
  }

  hideDialog(dialogController: DialogController) {
    throw new Error('DialogRenderer must implement hideDialog().');
  }
}
